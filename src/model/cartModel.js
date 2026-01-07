import connectDB from "../config/db.js";

export const addToCart = async (userId, productId, quantity, price) => {
  const db = await connectDB();
  // Check if item already exists in cart for this user
  const [exists] = await db.execute(
    "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );

  if (exists.length > 0) {
    return await db.execute(
      "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
      [quantity, exists[0].id]
    );
  }

  return await db.execute(
    "INSERT INTO cart_items (user_id, product_id, quantity, price_at_addition) VALUES (?,?,?,?)",
    [userId, productId, quantity, price]
  );
};

export const getCartByUser = async (userId) => {
  const db = await connectDB();
  const [rows] = await db.execute(
    `
        SELECT ci.*, p.name, p.price, p.category_id, p.is_coupon_eligible 
        FROM cart_items ci 
        JOIN products p ON ci.product_id = p.id 
        WHERE ci.user_id = ?`,
    [userId]
  );
  return rows;
};
