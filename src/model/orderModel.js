import connectDB from "../config/db.js";

export const createOrderWithItems = async (orderData, cartItems) => {
    const db = await connectDB();
    
    // Start Transaction
    await db.beginTransaction();

    try {
        // 1. Insert into orders table
        const [orderResult] = await db.execute(
            `INSERT INTO orders (user_id, subtotal, discount_amount, final_payable, coupon_applied) 
             VALUES (?, ?, ?, ?, ?)`,
            [orderData.userId, orderData.subtotal, orderData.discount, orderData.finalAmount, orderData.couponCode]
        );

        const orderId = orderResult.insertId;

        // 2. Insert items into order_items (Preserving Price)
        for (const item of cartItems) {
            await db.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price_at_addition]
            );
        }

        // 3. Clear the User's Cart
        await db.execute("DELETE FROM cart_items WHERE user_id = ?", [orderData.userId]);

        // Commit Transaction
        await db.commit();
        return orderId;
    } catch (error) {
        // If anything goes wrong, undo everything
        await db.rollback();
        throw error;
    }
};

export const getOrderHistory = async (userId) => {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    return rows;
};