import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Admin@123",
  database: "company",
  waitForConnections: true,
  connectionLimit: 10
});

const connectDB = async () => {
  try {
    await pool.getConnection();
    console.log("Database connected!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export { pool };
export default connectDB;
