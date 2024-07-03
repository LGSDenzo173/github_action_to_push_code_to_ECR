const authAdmin = require("../middleware/auth");
const express = require('express');
const bilanmapper = require('../models/bilanmapper');
const Mapper = require('../models/mappers');
const upload = require('../middleware/UploadExcel');
const Sankeys = require('../models/sankeydata');
const mysql = require('mysql');
const axios = require('axios');

// Database credentials
const db_config = {
  host: process.env.SQL_DB_HOST,
  user: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASSWORD,
  database: process.env.SQL_DB_NAME,
  port: 3306,
};

// Create a MySQL connection pool
const pool = mysql.createPool(db_config);

// Define a function to handle database queries
const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(query, params, (error, results, fields) => {
        connection.release();

        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
};

// Fetch the "id" values from the "sankeynodes" table
const getSankeyNodesData = async () => {
  const query = 'SELECT name, id, colour, image FROM sankeynodes';
  try {
    const rows = await executeQuery(query, []);
    return rows;
  } catch (err) {
    console.error(`Database error: ${err}`);
    return {};
  }
};


const router = express.Router();
const credentials = { username: 'ecosys', password: 'ecosys' };

// Get sankey for each country
router.get('/', async (req, res) => {
  try {
    const data = await bilanmapper.findAll();
    res.send(data);
  } catch (error) {
    res.status(error.status || 500).send('Something went wrong...');
  }
});

router.get('/get-mappers', async (req, res) => {
  try {
    const data = await Mapper.findAll({
      attributes: ['id', 'name', 'firstcell']
    });
    res.send(data);
  } catch (error) {
    res.status(error.status || 500).send('Something went wrong...');
  }
});

router.get("/get-mappers/:id", async (req, res) => {
  try {
    // Extracting the ID from the request parameters
    const { id } = req.params;

    // Finding the mapper by its primary key (ID)
    const mapper = await Mapper.findByPk(id);

    // Check if the mapper is found
    if (mapper) {
      // Return the mapper in the response with a 200 status


      res.status(200).json(mapper);
    } else {
      // If mapper is not found, respond with a 404 status and a message
      res.status(404).json({ message: "Mapper not found" });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/create-mapper', authAdmin, upload.single('ExcelFile'), async (req, res) => {
  try {
    req.body.ExcelFile = req?.file?.filename;
    const { name, mapper: mapperReq, ExcelFile, firstcell } = req.body;

    // Check if name is null or empty
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const mapper = (typeof mapperReq == "string") ? JSON.parse(mapperReq) : mapperReq;

    // Check if mapper is provided and is an array
    if (!mapper || !Array.isArray(mapper)) {
      return res
        .status(400)
        .json({ error: 'Mapper must be provided as an array' });
    }

    // Check if firstcell is a string
    if (typeof firstcell !== 'string' && firstcell === "") {
      return res.status(400).json({ error: "First cell of Excel Sheet must not be empty" })
    }

    // Check if the name already exists
    const existingMapper = await Mapper.findOne({ where: { name } });
    if (existingMapper) {
      return res
        .status(409)
        .json({ error: 'Mapper with the same name already exists' });
    }

    // Create a new mapper
    const newMapper = await Mapper.create({
      name,
      mapper,
      ExcelFile,
      firstcell
    });

    res.status(201).json({ message: 'Mapper saved successfully', mapper: newMapper });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/update-mapper/:id', authAdmin, async (req, res) => {
  try {
    const { name, mapper, firstcell } = req.body;
    const sankeyNodesData = await getSankeyNodesData();
    const mapperId = req.params.id;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    // Check if mapper is provided and is an array
    if (!mapper || !Array.isArray(mapper)) {
      return res.status(400).json({ error: 'Mapper must be provided as an array' });
    }

    // Check if firstcell is a string
    if (typeof firstcell !== 'string' && firstcell === "") {
      return res.status(400).json({ error: "First cell of Excel Sheet must not be empty" })
    }

    // Find the mapper by ID
    const existingMapper = await Mapper.findByPk(mapperId);
    if (!existingMapper) {
      return res.status(404).json({ error: "Mapper not found" });
    }

    // Update related sankeys if name is "Energy" or "Emission"
    if (name === "Energy" || name === "Emission") {
      const sankeyArray = await Sankeys.findAll({
        where: { sankeyType: name, is_published: true }
      });

      // Use Promise.all for parallel processing
      await Promise.all(sankeyArray.map(async sankey => {
        const API_URL = {
          Energy: `https://eis.ecowas.int/bilansankey?pays=${sankey.country}&annee=${sankey.year}`,
          Emission: `https://eis.ecowas.int/emissionsankey?pays=${sankey.country}&annee=${sankey.year}`,
        };

        const { status, data } = await axios.get(API_URL[name], { auth: credentials });

        if (status === 200 && data.length > 0) {
          const nodesList = [
            ...new Set(
              Object.values(mapper)
                .flatMap((node) => [node.srcId, node.trgId])
                .filter(Boolean)
            ),
          ];

          const result1 = sankeyNodesData
            .filter((node) => nodesList.includes(node.id))
            .map((n) => ({
              node_id: n.id,
              id: n.name,
              colour: n.colour,
              image: n.image,
            }));

          const filteredData = {
            links: data
              .filter((record) => {
                const matchingRecord = mapper.find(
                  (item) => item.cell === record.linecole
                );
                return (
                  matchingRecord !== undefined &&
                  matchingRecord.cell === record.linecole &&
                  record.valeur !== '0'
                );
              })
              .map((record) => {
                return {
                  // cell: record.linecole,
                  color: '#DC143C',
                  value: Math.abs(record.valeur),
                  source: result1.findIndex(
                    (n) =>
                      n.node_id ==
                      mapper.find((c) => c.cell == record.linecole)
                        ?.srcId
                  ),
                  target: result1.findIndex(
                    (n) =>
                      n.node_id ==
                      mapper.find((c) => c.cell == record.linecole)
                        ?.trgId
                  ),
                };
              }),
            nodes: result1,
          };

          await Sankeys.update(
            { data: filteredData, is_published: 1, created_by: 'ECOWAS EIS API', sankey_name: 'ECOWAS EIS API' },
            { where: { country: sankey.country, year: sankey.year, sankeyType: name } }
          );
        }
      }));
    }

    // Update agency data
    existingMapper.name = name;
    existingMapper.firstcell = firstcell;
    existingMapper.mapper = mapper;

    const updatedMapper = await existingMapper.save();

    // Send the response after the update
    res.status(200).json({ message: "updated successfully", mapper: updatedMapper });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

});

router.delete("/:id", authAdmin, async (req, res) => {
  try {
    // get request parameters
    const { id } = req.params;

    //Finding sankey
    const sankey = await Mapper.findOne({
      where: { id }
    })

    if (sankey === null) {
      res.status(404).send("Mapper doesn't exist");
    } else {
      // Query to delete sankey nodes data
      const data = await Mapper.destroy({
        where: { id }
      });
      res.status(200).send({ id, message: "Deleted successfully" });
    }
  } catch (error) {
    res.status(error.status || 500).send("Something went wrong...");
  }
})

module.exports = router;
