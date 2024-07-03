const _ = require('lodash');
const express = require("express");
const router = express.Router();
const Sankeys = require('../models/sankeydata');

// Create and save a new sankey into Sankeys Table
router.post('/', async (req, res) => {
    // Request payload data and header data
    const { sankey_id, sankey_name, year, country, data, created_by, sankeyType } = req.body;

    const token = req.header('x-auth-token');   // Future work

    try {
        // Check if sankeyType is valid
        const modelAttributes = Sankeys.getAttributes();
        const sankeyTypeValues = modelAttributes.sankeyType.values;
        // if (!sankeyTypeValues.includes(sankeyType)) {
        //     throw { status: 409, message: "Invalid Type." };
        // }

        // Check if sankey already exists?
        if (sankey_id) {
            let sankey = await Sankeys.findOne({ where: { sankey_id: sankey_id } });
            // Update sankey record
            let updatedSankey = await Sankeys.update(
                {
                    data: data ? data : sankey.data,
                    country: country ? country : sankey.country,
                    year: year ? year : sankey.year,
                    sankeyType: sankeyType
                },
                {
                    where: { sankey_id },
                    returning: true,
                    plain: true,
                }
            );

            // Send success response
            res.header('x-auth-token', token).status(200).send("Sankey updated successfully!");
        } else {
            // Insert sankey record
            await Sankeys.create(_.pick(req.body, ['year', 'country', 'data', 'created_by', 'sankey_name', 'sankeyType']));

            // Send success response
            res.header('x-auth-token', token).status(201).send("Sankey created successfully!");
        }
    } catch (error) {
        // Send error response
        console.log(error);
        res.header('x-auth-token', token).status(400).send("Error saving sankey data.");
    }
});

module.exports = router;
