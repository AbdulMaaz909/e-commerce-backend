import connectDB from "../config/db.js";

export const getAllProducts = async () => {
  const db = await connectDB();
  const [rows] = await db.execute(`
        SELECT p.*, c.name as category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.id
        `);
  return rows;
};
