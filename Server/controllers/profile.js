const handleProfile = (db) => (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })//when parameter is the same, e.g. id:id, we can just write id one time
        .then(user => {
            if (user.length) {
                res.json(user[0]);

            } else {
                res.status(400).json('Not found');
            }
        })
}

module.exports = {
    handleProfile: handleProfile
}