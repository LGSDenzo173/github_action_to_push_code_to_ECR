const sequelize = require("../db");
const { DataTypes } = require("sequelize");

// Create Emission Sankey Years Model
const sankeyEmissionYears = sequelize.define("emissionsankey", {
    idemissionsankey: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    pays: {
        type: DataTypes.STRING
    },
    annee: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'emissionsankey'
});

// Check if table exists in database
sequelize.sync().then(() => {
    console.log('emissionsankey table is now available!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = sankeyEmissionYears;