const express = require("express");
const router = express.Router();
const sankeydata = require("../models/sankeydata")

// Get sankey data for a specific year and country
router.patch('/', async (req, res) => {
    try {
        // get request parameters
       const { sankey_id} = req.body;
       if(!sankey_id) return res.status(400).send("Required field cannot be empty");

       const sankeyData = await sankeydata.findOne({ where:{sankey_id:sankey_id}})
       if(!sankeyData) return res.status(400).send("No Sankey Found");
       let updatedUser = await sankeydata.update(
        {
          is_ready: true,
        },
        {
          where: { sankey_id: sankeyData.sankey_id },
          returning: true,
          plain: true,
        }
      );
      return res.status(200).send("Sankey has been updated");
    } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong!");
    }

});

module.exports = router;