const express = require("express");
const router = express.Router();
const fs = require('fs');

// Edit the scaling of the graph
router.get('/', async (req, res) => {
    try {
        // Get the current nodePadding value
        let scale = JSON.parse(fs.readFileSync('./services/scale.json'));

        // Return value
        if(typeof scale !== "number") {
          return res.status(200).send(scale);
        } else {
          return res.status(500).send("No data avaialble")
        }

    } catch (error) {
        // Handle error
        return res.status(error.status || 500).send("Something went wrong...");
    }
});
  
module.exports = router;