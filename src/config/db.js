import mysql from "mysql2/promise";

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Database is connected!");
    return connection;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
