const express = require('express');
const { Op }=require("sequelize")
const Nodes = require('../models/sankeynodes');
const router = express.Router();

// Get all saved nodes of sankey
router.get('/', async (req, res) => {
  const { sankeytype } = req.query;

  const filter = {
    where: {
      sankeytype: {
        [Op.in]: ['Energy','Emission']
      }
    },
  };

  if (sankeytype && sankeytype != '') {
    filter.where = { sankeytype: sankeytype };
  }

  try {
    const data = await Nodes.findAll(filter);
    res.send(data);
  } catch (error) {
    res.status(error.status || 500).send('Something went wrong...');
  }
});

module.exports = router;
