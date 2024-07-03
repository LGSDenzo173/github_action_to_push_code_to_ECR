const express = require("express");
const router = express.Router();
const users = require('../models/users');
const sendEmail = require('../helper/sendEmail');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    // Validate

    // Check if email is already registered?
    const { email } = req.body;
    if (!email) return res.status(400).send('Email is required.');
    
    let user = await users.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).send('No such user exists.');
    
    // Send email to user with reset link
    const token = jwt.sign({ 
        id: user.id, 
        firstname: user.firstname, 
        lastname: user.lastname, 
        email: user.email,
        imgslug: user.imgslug
    }, process.env.jwtPrivateKey);

    const link = `http://ecowasbackend-env.eba-hvykxkzm.eu-west-1.elasticbeanstalk.com/resetPassword/${token}`; // Future work here!!!!

    await sendEmail(email, 'sm@k2x.tech',
        `<div>
            Click the link below to reset your password<br/>
            <a href="${link}">Reset Password</a>
        </div>`
    );
    return res.status(200).send({ message: 'Password reset link has been successfully sent to your inbox' });
});

module.exports = router;
