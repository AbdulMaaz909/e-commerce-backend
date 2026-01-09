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
    // Use a clean, single-line string or carefully formatted backticks
    const sql = `SELECT o.*, u.name as user_name 
                 FROM orders o 
                 JOIN users u ON o.user_id = u.id 
                 ORDER BY o.created_at DESC`;
    
    const [orders] = await db.execute(sql);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Full Error:", error);
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

export const getOrderDetails = async (req, res) => {
  try {
    // 1. Match the name used in the route (:id)
    const { id } = req.params; 
    const db = await connectDB();
    
    // 2. Try a simpler JOIN first to verify connectivity
    const [details] = await db.execute(`
      SELECT 
        oi.quantity, 
        oi.price_at_purchase, 
        p.name as product_name,
        c.name as category_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE oi.order_id = ?`, 
      [id]
    );

    if (details.length === 0) {
        return res.status(404).json({ message: "No items found for this order" });
    }

    res.status(200).json(details);
  } catch (error) {
    console.error("SQL ERROR:", error); // This will show you the EXACT error in your terminal
    res.status(500).json({ message: "Error fetching details", error: error.message });
  }
};
