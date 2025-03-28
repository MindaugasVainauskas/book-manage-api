import { DataTypes } from "sequelize";
import db from '../utils/database-config.js';

const Book = db.define('book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publish_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
},
{
    paranoid: true // Enabling soft delete so I can restore deleted book entry later if I want to.
});

export default Book;
