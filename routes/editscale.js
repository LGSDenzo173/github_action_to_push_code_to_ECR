const express = require("express");
const router = express.Router();
const fs = require('fs');

// Edit the scaling of the graph
router.put('/', async (req, res) => {
    try {
        const { scale } = req.body

        // Validations
        if(typeof scale !== "number") return res.status(400).send("Invalid data type.");
        if(40 < scale || scale < 0) return res.status(400).send("Value out of range.")

        // Save the updated nodePadding value to the scale.json file
        fs.writeFileSync('./services/scale.json', JSON.stringify({ nodePadding: scale }));
    
        // Respond with success
        res.status(200).send('Scale updated successfully!');
    } catch (error) {
        // Handle error
        console.log(error)
        return res.status(error.status || 500).send("Something went wrong...");
    }
});
  
module.exports = router;