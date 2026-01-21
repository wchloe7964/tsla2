import mongoose, { Schema, model, models } from "mongoose";

const SlideSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the slide."],
      trim: true,
      maxlength: [100, "Title cannot be longer than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a subtitle/description."],
      trim: true,
      maxlength: [500, "Description should stay concise for cinematic impact"],
    },
    image: {
      type: String,
      required: [true, "A background image URL is required."],
      // Validates it's a Cloudinary or HTTPS URL
      match: [/^(https?:\/\/)/, "Please provide a valid image URL"],
    },
    link: {
      type: String,
      default: "/",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true, // Optimizes the sort query for the homepage slider
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Optimizes fetching only active slides
    },
  },
  {
    timestamps: true,
    collection: "slides", // Explicitly naming the collection
  },
);

// Prevents re-compiling the model during Next.js Turbopack hot-reloads
const Slide = models.Slide || model("Slide", SlideSchema);

export default Slide;
