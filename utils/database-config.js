import { Sequelize } from "sequelize";
import { logger }from "../middleware/logger/index.js";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000, // Connection can be aqcuired for 30 seconds
            idle: 10000 // Connection can be idle for 10 seconds before being released
        }
    }
);

try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
} catch (error) {
    logger.error('Unable to connect to the database:', error);
}

export default sequelize;
