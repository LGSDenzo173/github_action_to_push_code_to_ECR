const sequelize = require('../config/db');
const express = require("express");
const _ = require('lodash');
const bilansankeycellule = require("../models/bilansankeycellule");
const bilansankey = require("../models/bilansankey");
const router = express.Router();

// Get all sankey values of sankey
router.get('/', async (req, res) => {
    try {
        const { pays, annee } = req.query;
        // Query to get all sankey values  data
        const sankeyData = await bilansankeycellule.findAll({
            include: {
              model: bilansankey,
              as:"bilansankey",
              where: {
                pays , annee
              },
              required: true
            }
          });
          const pickedFields = _.map(sankeyData, ({ colonne, ligne, valeur }) => ({ colonne, ligne, valeur }));
        res.status(200).send(pickedFields)
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).send("Something went wrong...");
    }
});

module.exports = router;