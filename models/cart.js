import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  prodId: String,
  name: String,
  price: Number,
  qty: Number,
});

const cartSchema = new Schema({
  cartId: {
    type: String,
    default: null,
  },
  userId: {
    type: String,
    required: true,
  },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
