const jwt = require('jsonwebtoken');
const { JWT_SECRT } = require('../key');
const Users = require('../models/Users');
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ error: "You must be logged in" })
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRT, (err, payload) => {
        if (err)
            return res.status(401).json({ error: "You must be logged in" })
        const { _id } = payload
        Users.findById(_id).then(userData => {
            req.users = userData;
            next();
        })
    })
}