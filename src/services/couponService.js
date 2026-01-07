export const validateAndCalculateDiscount = (
  coupon,
  cartItems,
  userOrderCount
) => {
  let subtotal = 0;
  let categoryTotals = {};

  // 1. Calculate totals and category-specific totals
  cartItems.forEach((item) => {
    const itemTotal = Number(item.price_at_addition) * Number(item.quantity);
    subtotal += itemTotal;

    const catId = item.category_id;
    categoryTotals[catId] = (categoryTotals[catId] || 0) + itemTotal;
  });

  let discountAmount = 0;

  // 2. Rule Engine
  switch (coupon.type) {
    case "CART_TOTAL":
      if (subtotal < coupon.min_requirement) {
        throw new Error(
          `Minimum spend of ₹${coupon.min_requirement} required for this coupon.`
        );
      }
      discountAmount = calculateValue(subtotal, coupon);
      break;

    case "CATEGORY_BASED":
      const relevantTotal = categoryTotals[coupon.category_id] || 0;
      if (relevantTotal < coupon.min_requirement) {
        throw new Error(
          `Minimum spend of ₹${coupon.min_requirement} in ${coupon.category_name} required.`
        );
      }
      discountAmount = calculateValue(relevantTotal, coupon);
      break;

    case "PRODUCT_SPECIFIC":
      const productInCart = cartItems.find(
        (item) => item.product_id === coupon.product_id
      );
      if (!productInCart) {
        throw new Error(
          "This coupon is only for a specific product not in your cart."
        );
      }
      discountAmount = calculateValue(
        Number(productInCart.price_at_addition),
        coupon
      );
      break;

    case "FIRST_TIME_USER":
      if (userOrderCount > 0) {
        throw new Error("This coupon is only for your first purchase.");
      }
      discountAmount = calculateValue(subtotal, coupon);
      break;

    default:
      throw new Error("Invalid coupon type.");
  }

  // Ensure discount doesn't exceed the total
  return Math.min(discountAmount, subtotal);
};

// Helper to handle Flat vs Percentage
const calculateValue = (baseAmount, coupon) => {
  if (coupon.discount_type === "PERCENT") {
    return (baseAmount * coupon.discount_value) / 100;
  } else {
    return coupon.discount_value;
  }
};
