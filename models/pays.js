const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

// Create Countries Model
const countries = sequelize.define("pays", {
    codePays: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    nomPays: {
        type: DataTypes.STRING
    }, 
    numpays_portugues: {
        type: DataTypes.STRING
    }, 
    nomPays_english: {
        type: DataTypes.STRING
    }, 
    flagslug: {
        type: DataTypes.STRING
    }, 
},{
    tableName: 'pays',
    timestamps: false
});

// Check if table exists in database
sequelize.sync().then(() => {
    console.log('pays table is now available!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = countries;