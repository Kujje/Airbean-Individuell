// models/promotion.js
import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  requiredItems: [
    {
      productId: {
        type: String,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],

  discountType: {
    type: String,
    enum: ["percentage", "fixedPrice"],
    required: true,
  },

  discountValue: {
    type: Number,
    required: true,
  },

  validFrom: {
    type: Date,
    default: Date.now,
  },
  validTo: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;
