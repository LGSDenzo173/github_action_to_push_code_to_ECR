const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Mapper = sequelize.define('mappers', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstcell: {
    type: DataTypes.STRING
  },
  ExcelFile: {
    type: DataTypes.STRING
  },
  mapper: {
    type: DataTypes.JSON
  },
});
// check if table and all the columns exist in database

// Check if table exists in database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('mapper table is now available!');
  })
  .catch((error) => {
    console.error('Unable to create table : ', error);
  });

module.exports = Mapper;
