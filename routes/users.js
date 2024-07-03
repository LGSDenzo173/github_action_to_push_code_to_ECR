const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const express = require("express");
const router = express.Router();
const users = require('../models/users');

// Sign up a user
router.post('/', async (req, res) => {
    // Validate

    // Check if email is already registered?
    let user = await users.findOne({ where: { email: req.body.email } });
    if (user) return res.status(400).send('User already registered.');

    // Insert into users table
    user = await users.build(_.pick(req.body, ['firstname', 'lastname', 'email', 'password']));

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.save();

    // Generate JWT Token
    const token = jwt.sign({ 
        id: user.id,
        firstname: user.firstname, 
        lastname: user.lastname, 
        email: user.email,
        imgslug: user.imgslug
    }, process.env.jwtPrivateKey);
    
    res.header('x-auth-token', token).send(_.pick(user, ['email', 'firstname', 'lastname']));
});

module.exports = router;