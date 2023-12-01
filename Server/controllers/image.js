const clarifai = require('./clarifai');

const handleImage = (db) => (req, res) => {
    const { id, imageUrl } = req.body;

    clarifai.makeClarifaiRequest(imageUrl)
        .then(result => {
            db('users').where('id', '=', id)
                .increment('entries', 1)
                .catch(err => res.status(400).json('unable to get entries'));
            res.json(result);
        });
}

module.exports = {
    handleImage: handleImage
}