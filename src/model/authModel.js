import connectDB from "../config/db.js";

const findUserByEmail = async (email) => {
  const db = await connectDB();
  const [rows] = await db.execute("SELECT * FROM users WHERE email= ?", [
    email,
  ]);
  return rows[0];
};

const createUser = async (name, email, password,role = 'user') => {
  const db = await connectDB();
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password,role) VALUES (?,?,?,?)",
    [name, email, password,role]
  );
  return result;
};

export { createUser, findUserByEmail };
