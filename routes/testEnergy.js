const sequelize = require('../config/db');
const express = require("express");
const { formatData } = require('../helper/formatSankey');
const router = express.Router();

// Get sankey for each country
router.get('/:cc', async (req, res) => {
    // Default country logic
    const country = req.params.cc || 'NA';
    
    // Query to get sankey data
    const data = await sequelize.query(`
        SELECT bilansankey.annee, bilanmapper.Input, bilanmapper.Output, bilansankeycellule.valeur, bilanmapper.Color, bilanmapper.Image 
        FROM bilanmapper, bilansankeycellule, bilansankey 
        WHERE bilanmapper.Cell = bilansankeycellule.linecole 
        && bilansankeycellule.idbilansankey = bilansankey.idbilansankey 
        && bilansankey.pays = "${country}" 
        && bilansankeycellule.valeur != "0"
        && bilansankeycellule.valeur != ""
        ORDER BY bilansankeycellule.idbilansankey ASC, bilansankeycellule.colonne ASC
    `);
    
    // Validation
    
    // Reformat and send response
    res.send(formatData(data[0]));
});

module.exports = router;