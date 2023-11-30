const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var cors = require('cors')
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'test_user',
        password: '11111111',
        database: 'smart_brain_db'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfile(db));
app.put('/image', image.handleImage(db));

app.listen(3000, () => {
    console.log('app is running on port 3000');
});