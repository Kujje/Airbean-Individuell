// services/order.js
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import calculateTotal from "../utils/calculateTotal.js";
import { generatePrefixedId } from "../utils/IdGenerator.js";

// Get all orders
export async function getAllOrders() {
  try {
    console.log("Fetching all orders from the database");
    return await Order.find({});
  } catch (error) {
    console.error("Error fetching all orders:", error.message);
    return null;
  }
}

// Get orders by user ID
export async function getOrderByUserId(userId) {
  try {
    return await Order.find({ userId });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    return null;
  }
}

 //Create a new order
export async function createOrder(cartId) {
  if (!cartId) throw new Error("Missing cartId");

  try {
    let cart = await Cart.findOne({ cartId });
    
    if (!cart || cart.items.length === 0) {
      console.error("Cart not found or is empty for cartId:", cartId);
      throw new Error("Cart not found or is empty");
    }

    const total = calculateTotal(cart.items);
     // Byt ut prefixet 'user-' eller 'guest-' mot 'order-'
    const orderId = generatePrefixedId('order');

    const newOrder = new Order({
      orderId: orderId,
      userId: cart.userId,
      items: cart.items,
      total,
    });

    await newOrder.save();
    //Töm kundvagn
    cart.items = []
    await cart.save()

    return newOrder
  } catch (error) {
    console.error("Error creating order:", error.message);
    throw error;
  }
} 
