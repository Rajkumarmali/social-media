const express = require('express');
const Users = require('../models/Users');
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRT } = require('../key');

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(422).json({ error: 'Please fill all information' });
    }

    Users.findOne({ email: email }).then((saveUser) => {
        if (saveUser) {
            return res.status(422).json({ error: 'User already exists' });
        }

        bcrypt.hash(password, 12).then(haspass => {
            const users = new Users({
                name, email,
                password: haspass,
                pic
            })
            users.save().then((users) => {
                res.json({ message: "User successfully Save" });
            }).catch(err => {
                console.log(err);
            })
        })
    }).catch(err => {
        console.log(err);
    })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(422).json({ error: "Please Provide email and password" });
    Users.findOne({ email: email }).then(saveUser => {
        if (!saveUser)
            return res.status(422).json({ error: "Invalid email" })
        bcrypt.compare(password, saveUser.password).then(doMatch => {
            if (doMatch) {
                //res.json("User in signIn");
                const token = jwt.sign({ _id: saveUser._id }, JWT_SECRT);
                const { _id, name, email, followers, following, pic } = saveUser;
                res.json({ token, users: { _id, name, email, followers, following, pic } })
            } else {
                return res.status(422).json({ error: "Invalid Password" });
            }
        }).catch(err => {
            console.log(err);
        })
    })
})

module.exports = router; 