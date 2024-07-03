// const sequelize = require('../config/db');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config();
const Sankeys = require('../models/sankeydata');
const Pays = require('../models/pays');

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

// Fetch the "Cell" values from the "emission_mapper" table
const getEmissionMapperData = async (name) => {
  const query = 'SELECT mapper FROM mappers where name=?';
  try {
    const rows = await executeQuery(query, [name]);
    return rows.reduce((result, row) => {
      return JSON.parse(row.mapper);
    }, {});
  } catch (err) {
    console.error(`Database error: ${err}`);
    return {};
  }
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

router.post('/:country/:year/:sankeyType/:created_by?', async (req, res) => {
  const { country, year, sankeyType, created_by } = req.params;
  const credentials = { username: 'ecosys', password: 'ecosys' };
  const emissionMapperData = await getEmissionMapperData(sankeyType);
  const sankeyNodesData = await getSankeyNodesData();
  const API_URLS = {
    Energy: `https://eis.ecowas.int/bilansankey?pays=${country}&annee=${year}`,
    Emission: `https://eis.ecowas.int/emissionsankey?pays=${country}&annee=${year}`,
  };

  const API_URL = API_URLS[sankeyType];
  try {
    const response = await axios.get(API_URL, { auth: credentials });

    if (response.status === 200) {
      const data = response.data;

      if(data.length <= 0) {
        throw new Error(`No data found for year ${year} in ${country}`);  
      }

      const nodesList = [
        ...new Set(
          Object.values(emissionMapperData)
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
            const matchingRecord = emissionMapperData.find(
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
                  emissionMapperData.find((c) => c.cell == record.linecole)
                    ?.srcId
              ),
              target: result1.findIndex(
                (n) =>
                  n.node_id ==
                  emissionMapperData.find((c) => c.cell == record.linecole)
                    ?.trgId
              ),
            };
          }),
        nodes: result1,
      };

      const checkData = await Sankeys.findOne({
        where: {
          country: country,
          year: year,
          sankeyType: sankeyType,
        },
      });

      if (checkData) {
        const update = await Sankeys.update(
          {
            data: filteredData,
            is_published: 1,
            created_by: created_by ? created_by : 'ECOWAS EIS API',
            sankey_name: 'ECOWAS EIS API',
          },
          {
            where: {
              country: country,
              year: year,
              sankeyType: sankeyType,
            },
          }
        );
        res.json({
          status: 1,
          message: 'Data Synced Successfully',
        });
      } else {
        const checkData = await Sankeys.create({
          country: country,
          year: year,
          sankeyType: sankeyType,
          created_by: created_by ? created_by : '',
          is_published: 1,
          is_ready: 1,
          data: filteredData,
          sankey_name: 'ECOWAS EIS API',
        });
        res.json({
          status: 1,
          message: 'Data Created Successfully',
        });
      }
    } else {
      res.json({
        status: 0,
        mesage: `Failed to fetch data for ${country}. Status code: ${response.status}`,
      });
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).send(`Error fetching data for ${country}`);
  }
});

router.get('/countries', async (req, res) => {
  try {
    const checkData = await Pays.findAll({});

    if (checkData) {
      res.json({
        status: 1,
        checkData,
        message: 'Data Successfully',
      });
    }
  } catch (error) {
    console.log(`Error fetching data for ${country}: ${error.message}`);
    res
      .status(500)
      .send(`Error fetching data for ${country}: ${error.message}`);
  }
});

module.exports = router;
