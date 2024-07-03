const sequelize = require('../config/db');
const express = require("express");
const router = express.Router();
const countries = require('../models/pays');
const { Op } = require("sequelize");

// Get countries table
router.get('/', async (req, res) => {
    // Find CEDEAO record
    const cedeao = await countries.findByPk('CEDEAO');
    
    // Find all countries records except CEDEAO
    const countryData = await countries.findAll({
        where: {
            codePays: {
                [Op.ne]: ['CEDEAO']
            }
        },
        order: [
            ["nomPays", 'ASC']
        ]
    });

    // Add CEDEAO record to the beginning of all countries
    countryData.unshift(cedeao);
    
    res.send(countryData);
});

module.exports = router;