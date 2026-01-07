import * as cartModel from '../model/cartModel.js';
import connectDB from '../config/db.js';
import { validateAndCalculateDiscount } from '../services/couponService.js';

const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body; // Fixed typo: bdoy -> body
        const userId = req.userId;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and Quantity are required" });
        }

        const db = await connectDB();
        const [product] = await db.execute(
            "SELECT price FROM products WHERE id = ?", [productId]
        );

        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        const currentPrice = product[0].price;

        // Ensure you are passing the userId from your JWT middleware
        await cartModel.addToCart(userId, productId, quantity, currentPrice);

        res.status(200).json({ message: "Items added to cart successfully!" });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ message: "Error adding to cart!" });
    }
}

const getUserCart = async (req, res) => {
    try {
        const userId = req.userId;
        const items = await cartModel.getCartByUser(userId);

        let subtotal = 0;
        items.forEach(item => {
            // Force number conversion to ensure math is correct
            subtotal += Number(item.price_at_addition) * Number(item.quantity);
        });

        res.status(200).json({ // Fixed status: 400 -> 200
            cart: items,
            subtotal: subtotal,
            discount: 0,
            finalAmount: subtotal // Fixed typo: Amout -> Amount
        });
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ message: "Error while getting user cart!" });
    }
}


export { addItemToCart, getUserCart };