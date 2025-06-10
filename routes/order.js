import { Router } from "express";

import { getOrderByUserId, getAllOrders } from "../services/order.js";
import { createOrder } from "../services/order.js";

import { validateCartInBody } from "../middlewares/validators.js";
import { validateUser } from "../middlewares/validators.js";

const router = Router();

// GET all orders - /api/orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    if (orders && orders.length > 0) {
      res.json({
        success: true,
        orders,
        count: orders.length,
      });
    } else {
      next({
        status: 404,
        message: "No orders found",
      });
    }
  } catch (error) {
    next({
      status: 500,
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

// GET orders by user ID - /api/orders/:userId
router.get("/:userId", validateUser, async (req, res, next) => {
  const { userId } = req.params;
  console.log(`Fetching orders for user ID: ${userId}`);

  const orders = await getOrderByUserId(userId);
  if (orders && orders.length > 0) {
    res.json({ success: true, orders });
  } else {
    next({
      status: 404,
      message: "No orders found for this user",
    });
  }
});


//Create order route
router.post("/", validateCartInBody, async (req, res) => {

  const { cartId } = req.body;

  try {
    const order = await createOrder(cartId);
    res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
