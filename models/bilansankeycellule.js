const sequelize = require("../config/db");
const bilansankey = require('./bilansankey')
const { DataTypes } = require("sequelize");

// Create Energy Sankey Data Model
const sankeyEnergyData = sequelize.define("bilansankeycellule", {
    idbilansankey: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    ligne: {
        type: DataTypes.STRING
    },
    colonne: {
        type: DataTypes.STRING
    },
    valeur: {
        type: DataTypes.STRING
    },
    typeproduit: {
        type: DataTypes.INTEGER
    },
    produit: {
        type: DataTypes.INTEGER
    },
    donnees: {
        type: DataTypes.STRING
    },
    linecole: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'bilansankeycellule',
    timestamps: false,
});

//Relation of sankeyEnergyData table with bilansankey
sankeyEnergyData.hasOne(bilansankey,{
    as:"bilansankey",
    foreignKey: "idbilansankey",
    sourceKey: "idbilansankey",
});



// Check if table exists in database
sequelize.sync().then(() => {
    console.log('bilansankeycellule table is now available!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


module.exports = sankeyEnergyData;