import * as cartModel from '../model/cartModel.js';
import * as orderModel from '../model/orderModel.js';
import { validateAndCalculateDiscount } from '../services/couponService.js';
import connectDB from '../config/db.js';

export const checkout = async (req, res) => {
    try {
        const userId = req.userId;
        const { couponCode } = req.body; // Optional coupon

        // 1. Fetch current cart items
        const cartItems = await cartModel.getCartByUser(userId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cannot checkout with an empty cart" });
        }

        // 2. Calculate Subtotal
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += Number(item.price_at_addition) * Number(item.quantity);
        });

        let discount = 0;
        let appliedCode = null;

        // 3. Re-validate Coupon (If provided)
        if (couponCode) {
            const db = await connectDB();
            const [coupons] = await db.execute("SELECT * FROM coupons WHERE code = ?", [couponCode]);
            
            if (coupons.length > 0) {
                const coupon = coupons[0];
                const [orders] = await db.execute("SELECT COUNT(*) as count FROM orders WHERE user_id = ?", [userId]);
                
                try {
                    discount = validateAndCalculateDiscount(coupon, cartItems, orders[0].count);
                    appliedCode = couponCode;
                } catch (err) {
                    return res.status(400).json({ message: "Coupon error: " + err.message });
                }
            }
        }

        const finalAmount = subtotal - discount;

        // 4. Create Immutable Order (The Model we made earlier)
        const orderData = {
            userId,
            subtotal,
            discount,
            finalAmount,
            couponCode: appliedCode
        };

        const orderId = await orderModel.createOrderWithItems(orderData, cartItems);

        res.status(201).json({
            message: "Order placed successfully!",
            orderId: orderId,
            summary: {
                total: subtotal,
                discount: discount,
                paid: finalAmount
            }
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Failed to place order" });
    }
};