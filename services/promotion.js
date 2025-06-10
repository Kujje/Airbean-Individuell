import Promotion from "../models/promotion.js";

// Create a new promotion
export async function createPromotion(data) {
  try {
    const promo = new Promotion(data);
    return await promo.save();
  } catch (error) {
    console.error("Error creating promotion:", error.message);
    throw error;
  }
}

// Get all promotions
export async function getAllPromotions() {
  try {
    return await Promotion.find();
  } catch (error) {
    console.error("Error fetching promotions:", error.message);
    throw error;
  }
}
