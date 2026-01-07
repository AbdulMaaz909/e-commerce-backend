# E-Commerce Backend

A Node.js backend for a simple e-commerce platform with user authentication, cart, coupon, and order management.

---

## 🚀 Setup Instructions

1. **Clone the repository:**
	 ```bash
	 git clone https://github.com/AbdulMaaz909/e-commerce-backend.git
	 cd e-commerce-backend
	 ```
2. **Install dependencies:**
	 ```bash
	 npm install
	 ```
3. **Configure environment variables:**
	 - Create a `.env` file in the root directory with:
		 ```env
		 JWT_SECRET=your_jwt_secret
		 PORT=8080
		 ```
4. **Set up MySQL database:**
	 - Ensure MySQL is running and create a database named `e_commerce`.
	 - Update credentials in `src/config/db.js` if needed.
5. **Run the server:**
	 ```bash
	 npm run dev
	 ```

---

## 🗄️ Database Schema (MySQL)

### `users`
| Field     | Type         | Description         |
|-----------|--------------|--------------------|
| id        | INT, PK, AI  | User ID            |
| name      | VARCHAR(100) | User name          |
| email     | VARCHAR(100) | Unique email       |
| password  | VARCHAR(255) | Hashed password    |
| role      | VARCHAR(20)  | 'user' or 'admin'  |
| created_at| TIMESTAMP    | Default: NOW()     |

### `products`
| Field         | Type         | Description           |
|---------------|--------------|----------------------|
| id            | INT, PK, AI  | Product ID           |
| name          | VARCHAR(100) | Product name         |
| price         | DECIMAL      | Product price        |
| category_id   | INT          | FK to categories     |
| is_coupon_eligible | BOOL     | Eligible for coupons |

### `categories`
| Field     | Type         | Description     |
|-----------|--------------|----------------|
| id        | INT, PK, AI  | Category ID    |
| name      | VARCHAR(100) | Category name  |

### `cart_items`
| Field           | Type         | Description                |
|-----------------|--------------|----------------------------|
| id              | INT, PK, AI  | Cart item ID               |
| user_id         | INT          | FK to users                |
| product_id      | INT          | FK to products             |
| quantity        | INT          | Quantity in cart           |
| price_at_addition | DECIMAL    | Price when added to cart   |

### `orders`
| Field           | Type         | Description                |
|-----------------|--------------|----------------------------|
| id              | INT, PK, AI  | Order ID                   |
| user_id         | INT          | FK to users                |
| subtotal        | DECIMAL      | Cart subtotal              |
| discount_amount | DECIMAL      | Discount applied           |
| final_payable   | DECIMAL      | Final amount after discount|
| coupon_applied  | VARCHAR(50)  | Coupon code (nullable)     |
| created_at      | TIMESTAMP    | Default: NOW()             |

### `order_items`
| Field           | Type         | Description                |
|-----------------|--------------|----------------------------|
| id              | INT, PK, AI  | Order item ID              |
| order_id        | INT          | FK to orders               |
| product_id      | INT          | FK to products             |
| quantity        | INT          | Quantity ordered           |
| price_at_purchase | DECIMAL    | Price at purchase          |

### `coupons`
| Field           | Type         | Description                |
|-----------------|--------------|----------------------------|
| id              | INT, PK, AI  | Coupon ID                  |
| code            | VARCHAR(50)  | Unique coupon code         |
| type            | ENUM         | CART_TOTAL, CATEGORY_BASED, PRODUCT_SPECIFIC, FIRST_TIME_USER |
| discount_type   | ENUM         | PERCENT, FLAT              |
| discount_value  | DECIMAL      | Discount value             |
| min_requirement | DECIMAL      | Min spend for eligibility  |
| category_id     | INT          | For CATEGORY_BASED         |
| product_id      | INT          | For PRODUCT_SPECIFIC       |
| category_name   | VARCHAR(100) | For CATEGORY_BASED         |

---

## 🎟️ Coupon Logic Explanation

Coupon logic is handled in `src/services/couponService.js` and supports:

- **CART_TOTAL**: Applies if cart subtotal meets `min_requirement`.
- **CATEGORY_BASED**: Applies if spend in a specific category meets `min_requirement`.
- **PRODUCT_SPECIFIC**: Applies if a specific product is in the cart.
- **FIRST_TIME_USER**: Applies only if the user has no previous orders.
- **Discount Types**: `PERCENT` (percentage off) or `FLAT` (fixed amount).
- **Validation**: Coupon is validated for eligibility and discount is capped at subtotal.

---

## 📋 Assumptions & Edge Cases Handled

- Coupon codes are case-sensitive and must exist in the `coupons` table.
- Only one coupon can be applied per order.
- Coupon validation checks for minimum spend, category/product presence, and user eligibility.
- Discount cannot exceed the cart subtotal.
- First-time user coupons are only valid for users with zero orders.
- Product and category IDs must match those in the cart for respective coupon types.
- Cart must not be empty to apply a coupon or checkout.
- All prices are calculated at the time of cart addition (not real-time product price).

---

## 📬 Sample API Responses & Postman Collection

- [Postman Collection (API Docs & Examples)](https://web.postman.co/workspace/Personal-Workspace~07bfdca9-dd5b-4eff-86d4-7c4d15cd1fe3/collection/41778386-1ebc8088-0fb1-42ee-ac69-20ed41fccfa2?action=share&source=copy-link&creator=41778386)

### Example: Apply Coupon
```json
POST /api/applycoupon
{
	"couponCode": "WELCOME10"
}
Response:
{
	"message": "Coupon applied!",
	"discount": 100,
	"appliedCoupon": "WELCOME10"
}
```

### Example: Checkout
```json
POST /api/checkout
{
	"couponCode": "WELCOME10"
}
Response:
{
	"message": "Order placed successfully!",
	"orderId": 1,
	"summary": {
		"total": 1000,
		"discount": 100,
		"paid": 900
	}
}
```

---

## 📝 Notes
- For more API details, see the Postman collection above.
- Update DB credentials in `src/config/db.js` as needed.
- Contributions welcome!
