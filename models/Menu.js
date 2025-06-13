import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    prodId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true }
  },
  {
    collection: "products",
    timestamps: { createdAt: "createdAt", updatedAt: "modifiedAt" }
  }
);

const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);

export default Menu;
