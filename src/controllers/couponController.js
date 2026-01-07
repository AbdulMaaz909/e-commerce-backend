import connectDB from '../config/db.js';
import * as cartModel from '../model/cartModel.js';
import { validateAndCalculateDiscount } from '../services/couponService.js';


const applyCouponToCart = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const userId = req.userId;

        const db = await connectDB();

        // 1. Get Coupon Details
        const [coupons] = await db.execute("SELECT * FROM coupons WHERE code = ?", [couponCode]);
        if (coupons.length === 0) return res.status(404).json({ message: "Coupon not found" });
        const coupon = coupons[0];

        // 2. Get Cart Items
        const items = await cartModel.getCartByUser(userId);
        if (items.length === 0) return res.status(400).json({ message: "Cart is empty" });

        // 3. Get User Order Count (for First-Time coupons)
        const [orders] = await db.execute("SELECT COUNT(*) as count FROM orders WHERE user_id = ?", [userId]);
        const orderCount = orders[0].count;

        // 4. Validate and Calculate
        try {
            const discount = validateAndCalculateDiscount(coupon, items, orderCount);
            
            // Note: In a real app, you'd save the coupon_id to the user's cart in DB here
            res.status(200).json({
                message: "Coupon applied!",
                discount: discount,
                appliedCoupon: couponCode
            });
        } catch (logicError) {
            res.status(400).json({ message: logicError.message });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error applying coupon" });
    }
};
export {applyCouponToCart}