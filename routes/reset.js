const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require('../models/users');
const jwt = require('jsonwebtoken');

router.put('/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    let updatedUser = await users.update(
        { 
            password: hash
        },
        {
            where: { id: decoded.id },
            returning: true,
            plain: true,
        }
    );

    // const { id, firstname, email } = updatedUser[1];
    return res.status(200).send("Password reset successfully");
});

module.exports = router;