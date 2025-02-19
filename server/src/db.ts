import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config()

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER , 
  password: process.env.PASSWORD,
  database: process.env.DB
});



db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("MySQL Connected!");
});


export const closeDB = () => {
  db.end(err => {
    if (err) {
      console.error("Error closing database connection:", err);
    } else {
      console.log("Database connection closed.");
    }
  });
};

export default db;
