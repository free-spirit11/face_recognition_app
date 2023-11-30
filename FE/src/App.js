import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticleComponent from './components/ParticleComponent';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const returnClarifyRequestOptions = (imageUrl) => {
    const PAT = '6b5531d9b2f14276a32e427457a4bb8c';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = '4uf03bwvpmyq';
    const APP_ID = 'my-first-application';
    // Change these to whatever model and image URL you want to use
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions;
}

const initialState = {
    input: '',
    imageUrl: '',
    box: [],
    route: 'signing',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: [],
            route: 'signing',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                entries: 0,
                joined: ''
            }
        }
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        })
    }

    calculateFaceLocation = (result) => {
        const regions = result.outputs[0].data.regions;
        const boxes = [];

        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);

        regions.forEach(region => {

            const box = {};
            const boundingBox = region.region_info.bounding_box;
            box.topRow = (boundingBox.top_row * height).toFixed(3);
            box.leftCol = (boundingBox.left_col * width).toFixed(3);
            box.bottomRow = (height * boundingBox.bottom_row).toFixed(3);
            box.rightCol = (width * boundingBox.right_col).toFixed(3);
            boxes.push(box);
        });
        return boxes;
    }

    displayFaceBox = (box) => {
        this.setState({ box: box });
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifyRequestOptions(this.state.input))
            .then(response => response.json())
            .then(result => {
                if (result) {
                    fetch('http://localhost:3000/image', {
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, { entries: count }));
                        })
                        .catch(console.log)
                }
                this.displayFaceBox(this.calculateFaceLocation(result));
            })
            .catch(error => console.log('error', error));
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState)
        } else if (route === 'home') {
            this.setState({ isSignedIn: true })
        }
        this.setState({ route: route });
    }

    render() {
        const { isSignedIn, imageUrl, route, box } = this.state;
        return (
            <div className="App">
                <ParticleComponent />
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
                <Logo />
                {route === 'home'
                    ? <div>
                        <Rank name={this.state.user.name} entries={this.state.user.entries} />
                        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                        <FaceRecognition boxes={box} imageUrl={imageUrl} />
                    </div>
                    : (
                        route === 'signing'
                            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                    )
                }
            </div>
        );
    }
}

export default App;