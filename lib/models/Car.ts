import mongoose, { Schema, model, models } from "mongoose";

const CarSchema = new Schema(
  {
    name: { type: String, required: true },
    model: {
      type: String,
      required: true,
      enum: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
    },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["New", "Pre-Owned", "Demo Vehicle"],
      default: "New",
    },
    mileage: { type: Number, default: 0 },
    location: { type: String, default: "Fremont, CA" },
    delivery: { type: String, default: "1-2 weeks" },
    reduction: { type: Number, default: 0 },
    specs: {
      range: { type: String },
      acceleration: { type: String },
      topSpeed: { type: String },
      seats: { type: Number, default: 5 },
      drive: { type: String, default: "Dual Motor AWD" },
    },
    features: [
      {
        label: { type: String },
        isFree: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default models.Car || model("Car", CarSchema);
