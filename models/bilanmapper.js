const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

// Create Model for Energy Sankey Mapper
const mappedEnergyData = sequelize.define("bilanmapper", {
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
    },
    Image: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'bilanmapper2',
    timestamps: false
});

// Check if table exists in database
sequelize.sync().then(() => {
    console.log('bilanmapper table is now available!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = mappedEnergyData;