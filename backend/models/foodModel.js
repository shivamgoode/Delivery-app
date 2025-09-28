import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },

  // ✅ Reviews array (initially empty)
  reviews: [
    {
      name: { type: String, required: true },   // Person who gave the review
      text: { type: String, required: true },   // Review message
      createdAt: { type: Date, default: Date.now } // Timestamp
    }
  ]
});

const foodModel =
  mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
