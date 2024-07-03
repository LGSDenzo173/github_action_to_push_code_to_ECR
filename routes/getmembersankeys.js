const express = require("express");
const router = express.Router();
const Sankeys = require('../models/sankeydata');

// Get sankey data for a specific year and country
router.get('/', async (req, res) => {
    try {
        const { role } = req.authData;
        if(role === 'admin') {
            const data = await Sankeys.findAll({
                where:{
                    is_ready: true,
                }
            })
            res.status(200).send(data)
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong!");
    }

});

module.exports = router;