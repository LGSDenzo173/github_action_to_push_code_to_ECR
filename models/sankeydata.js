const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

// Create a Model for the data of all the Sankeys
const sankeyData = sequelize.define("sankeydata", {
    sankey_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    sankey_name:{
        type: DataTypes.STRING
    },
    created_by:{
        type: DataTypes.STRING
    },
    is_ready:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_published:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    year: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    sankeyType:{
        type: DataTypes.STRING,
      allowNull: false,
    },
    date_time:{
        type: DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
}, {
    tableName: 'sankeydata',
    timestamps: false
});

// Check if table exists in database
sequelize.sync().then(() => {
    console.log('sankey table is now available!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = sankeyData;