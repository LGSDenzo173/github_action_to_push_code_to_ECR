const express = require("express");
const Nodes = require("../models/sankeynodes");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sankeyData = require("../models/sankeydata");

// Get all saved nodes of sankey
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const currentNode = await Nodes.findOne({ where: { id: parseInt(id) } });
        if (!currentNode?.id) return res.status(400).send('No such node exists.');

        const sankeys = await sankeyData.findAll({ where: { sankeyType: currentNode.sankeytype } });

        let count = true;
        sankeys.forEach(item => {
            let sankeyNodes = item.data.nodes;
            sankeyNodes.forEach(sankeynode => {
                if (sankeynode.id == currentNode.name) {
                    count = false;
                }
            })
        });

        if(!count) return res.status(400).send("Node is currently used in a Sankey!");

        const node = Nodes.destroy({ where: { id: parseInt(id) } });

        if (node?.image) {
            const imagepath = path.join(__dirname, '..', 'public/nodes', node.image)
            if (fs.existsSync(imagepath)) {
                fs.unlinkSync(imagepath)
            }
        }

        return res.status(200).send({ message: "Node deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(error.status || 500).send(error);
    }
});

module.exports = router;