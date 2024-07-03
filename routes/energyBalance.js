const sequelize = require('../config/db');
const express = require("express");
const { formatToSankey } = require('../helper/formatToSankey');
const router = express.Router();
const Nodes =  require("../models/sankeynodes")
const modify = require("../helper/modifycolor")

// Get sankey for each country
router.get('/:cc', async (req, res) => {
    // Default country logic
    const country = req.params.cc || 'NA';
    
    
    // Query to get sankey data
    const data = await sequelize.query(`
    SELECT bilansankey.annee, bilanmapper2.Input, bilanmapper2.Output, ABS(bilansankeycellule.valeur) as valeur, bilanmapper2.Color, bilanmapper2.Image
    FROM bilanmapper2, bilansankeycellule, bilansankey
    WHERE bilanmapper2.Cell = bilansankeycellule.linecole
    AND bilansankeycellule.idbilansankey = bilansankey.idbilansankey
    AND bilansankey.pays = "${country}"
    AND bilansankeycellule.valeur != '0'
    AND bilansankeycellule.valeur != ''
    ORDER BY bilansankeycellule.idbilansankey ASC, bilansankeycellule.colonne ASC;
`);
    const nodes = await Nodes.findAll()
    // Validation
    
    const modifiedData = modify(formatToSankey(data[0]), nodes); 
    // Reformat and send response
    res.send(modifiedData);
});

module.exports = router;