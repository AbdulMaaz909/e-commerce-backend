import connectDB from "../config/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const [users] = await db.execute(
      "SELECT id,name,role,created_at FROM users"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error While Getting Users" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const db = await connectDB();
    const [orders] = await db.execute(`
            SELECT o.*,u.name as user_name
            FROM orders o 
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC`);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while getting Orders" });
  }
};

export const getUserCartAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const [cartItems] = await db.execute(
      `
            SELECT ci.*, p.name as product_name
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?`,
      [id]
    );
    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user cart" });
  }
};
