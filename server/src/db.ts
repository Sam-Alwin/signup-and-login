import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.HOST,
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  logging: false, 
});

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("Database synchronized ");
  })
  .catch((err) => {
    console.error("Sequelize Sync Error:", err);
    process.exit(1);
  });


sequelize.authenticate()
  .then(() => {
    console.log("MySQL Connected via Sequelize!");
  })
  .catch((err) => {
    console.error("MySQL connection failed:", err);
    process.exit(1);
  });

export const closeDB = async () => {
  try {
    await sequelize.close();
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
};

export default sequelize;
