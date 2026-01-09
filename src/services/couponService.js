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

    const catId = Number(item.category_id); 
    categoryTotals[catId] = (categoryTotals[catId] || 0) + itemTotal;
  });

  let discountAmount = 0;

  // 2. Rule Engine
  switch (coupon.type) {
    case "CART_TOTAL":
      if (subtotal < coupon.min_requirement) {
        throw new Error(
          `Spend of ₹${coupon.min_requirement} to use ${coupon.code}.`
        );
      }
      discountAmount = calculateValue(subtotal, coupon);
      break;

      // For DRINK200: coupon.category_id in DB must be 2
    case "CATEGORY_BASED":
      const relevantTotal = categoryTotals[coupon.category_id] || 0;
      if (relevantTotal < coupon.min_requirement) {
        throw new Error(
          `Spend of ₹${coupon.min_requirement} on eligible item to use  ${coupon.code}.`
        );
      }
      discountAmount = calculateValue(relevantTotal, coupon);
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
