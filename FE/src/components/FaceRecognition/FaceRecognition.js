import React from 'react';

const FaceRecognition = ({ imageUrl, boxes }) => {
    const renderBoxes = () => {
        return boxes.map((box, index) => {
            const boxStyle = {
                top: box.topRow + 'px',
                right: box.rightCol + 'px',
                bottom: box.bottomRow + 'px',
                left: box.leftCol + 'px',
                position: 'absolute',
                boxShadow: '0 0 0 3px #fe0303 inset',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                cursor: 'pointer',
                width: box.rightCol - box.leftCol + 'px',
                height: box.bottomRow - box.topRow + 'px',
            };

            return (
                <div
                    key={index}
                    style={boxStyle}
                ></div>
            );
        });
    };

    return (
        <div className='center ma'>
            <div className="absolute mt2">
                <img id='inputimage' alt='' src={imageUrl} width='700px' height='auto'></img>
                {renderBoxes()}
            </div>
        </div>
    );
}

export default FaceRecognition;