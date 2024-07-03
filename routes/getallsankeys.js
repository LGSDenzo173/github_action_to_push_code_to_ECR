const express = require("express");
const router = express.Router();
const Sankeys = require('../models/sankeydata');

// Get sankey data for a specific year and country
router.get('/:createdby', async (req, res) => {
    try {
        const { role } = req.authData;
        const  created = req.params.createdby;
        if(role === 'admin') {
            const data = await Sankeys.findAll({
                where:{
                    created_by: created
                }
            })
            res.status(200).send(data)
        }else if(role === 'sie_national' || role === 'redacteur'){
            const data = await Sankeys.findAll({
                where:{
                    created_by: created             
                }
            })
            res.status(200).send(data)
        }else {
            res.status(401).send("Unauthorized")
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong!");
    }

});

module.exports = router;