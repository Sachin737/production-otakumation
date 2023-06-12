import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "product",
      },
    ],
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    payment: {},
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamp: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
