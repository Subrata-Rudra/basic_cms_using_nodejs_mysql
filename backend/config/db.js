const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();
var connection = mysql.createConnection({
  port: 3306,
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const connectDb = async () => {
  try {
    await connection.connect((error) => {
      if (error) {
        throw error;
      }
      console.log("MySQL database connected.");
    });
  } catch (error) {
    console.log("Tried to connect to MySQL, but failed.");
    console.log("MySQL_ERROR: ", error);
    process.exit();
  }
};

module.exports = { connection, connectDb };
