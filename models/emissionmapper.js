const sequelize = require("../db");
const { DataTypes } = require("sequelize");

// Create Emission Mapper Model
const mappedEmissionData = sequelize.define("emissionmapper", {
    Cell: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    Input: {
        type: DataTypes.STRING
    },
    Output: {
        type: DataTypes.STRING
    },
    Color: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'emissionmapper'
});

// Check if table exists in database
sequelize.sync().then(() => {
    console.log('emissionmapper table is now available!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = mappedEmissionData;