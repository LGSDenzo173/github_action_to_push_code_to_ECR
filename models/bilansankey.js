const sequelize = require("../config/db");
const bilansankeycellule = require('./bilansankeycellule')
const { DataTypes } = require("sequelize");

// Create Energy Sankey Years Model
const sankeyEnergyYears = sequelize.define("bilansankey", {
    idbilansankey: {
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
    tableName: 'bilansankey',
    timestamps:false,
});

//Relation of sankeyEnergyData table with bilansankey
sankeyEnergyYears.associate = () => {
    sankeyEnergyYears.belongsTo(bilansankeycellule, {
      as: "bilansankeycellule",
      foreignKey: "idbilansankey",
      sourceKey: "idbilansankey",
    });
}


// Check if table exists in database
sequelize.sync().then(() => {
    console.log('bilansankey table is now available!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});


module.exports = sankeyEnergyYears;