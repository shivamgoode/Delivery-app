import foodModel from "../models/foodModel.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// ==================== Add Food ====================
const addFood = async (req, res) => {
  let image_filename = "";
  if (req.file && req.file.filename) {
    image_filename = req.file.filename;
  }

  const { name, description, price, category } = req.body;
  if (!name || !description || !price || !category) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const food = new foodModel({
      name,
      description,
      price,
      category,
      image: req.file.filename,
      imageUrl: result.secure_url,
    });

    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ==================== List Food ====================
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ==================== Remove Food ====================
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body._id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body._id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ==================== Add Review ====================
// Add a review
 const addReview = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ success: false, message: "Review text is required" });

    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ success: false, message: "Food item not found" });

    // Add review
    const review = {
      userName: req.user.name || "Anonymous", // from auth middleware
      text,
    };
    food.reviews = food.reviews || [];
    food.reviews.push(review);

    await food.save();

    res.json({ success: true, message: "Review added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get reviews
const getReviews = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await foodModel.findById(foodId);

    if (!food) return res.status(404).json({ success: false, message: "Food item not found" });

    res.json({ reviews: food.reviews || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export { addFood, listFood, removeFood, addReview, getReviews };
