import { pool } from "../config/db.js";

const createUser = async (user) => {
  const { name, email, password } = user;

  const [result] = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );

  return result;
};

const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

export { createUser, getAllUsers };