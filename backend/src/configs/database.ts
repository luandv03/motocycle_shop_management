import "reflect-metadata"; // Import reflect-metadata
import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT as any, // Cast to 'any' to match Sequelize types
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [__dirname + "/../models"], // Adjusted path to models
});

export default sequelize;
