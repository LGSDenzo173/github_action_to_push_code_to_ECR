const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

// Create Users Model (validated here)
const users = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING(255),
        validate: { len: [1, 255] },
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(255),
        validate: { len: [1, 255] },
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        validate: { 
            len: [5, 255], 
            isEmail: true
        },
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(1024),
        validate: { len: [0, 1024] },
        allowNull: false
    },
    imgslug: {
        type: DataTypes.STRING(1024),
        defaultValue: "profile.png",
        allowNull: false
    }
}, {
    tableName: 'users'
});

// Check if table exists in database
sequelize.sync().then(() => {
    console.log('users table is now available!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = users;