import Cart from "../models/cart.js";

import { generatePrefixedId } from "../utils/IdGenerator.js";

export async function getCart(cartId) {
  if (!cartId) throw new Error("Missing cartId");
  
  try {
    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      throw new Error(`Cart with id ${cartId} not found.`);
    }
    return cart;
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error.message);
    throw error;
  }
}

export const updateCart = async (req, res, next) => {
  try {
    const { prodId, qty, guestId } = req.body;
    const userId = global.user?.userId || guestId || `${generatePrefixedId("guest")}`;

     // Byt ut prefixet 'user-' eller 'guest-' mot 'cart-'
    const cartId = userId.replace(/^(user|guest)-/, 'cart-');

    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      cart = new Cart({
        cartId: cartId,
        userId,
        items: []
      });
    }

    const index = cart.items.findIndex(item => item.prodId === prodId);

    if (qty === 0) {
      if (index !== -1) cart.items.splice(index, 1);
    } else {
      if (index !== -1) {
        cart.items[index].qty = qty;
      } else {
        cart.items.push({ prodId, qty });
      }
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};
export async function getAllCarts() {
  try {
    return await Cart.find();
  } catch (error) {
    console.error("Failed to fetch carts:", error);
    throw error;
  }
}