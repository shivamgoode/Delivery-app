import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";

// ==================== Add Food ====================
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "foods",
      quality: "auto",
      fetch_format: "auto",
    });

    const food = new foodModel({
      name,
      description,
      price,
      category,
      imageUrl: result.secure_url, // Only store Cloudinary URL
    });

    await food.save();
    res.json({ success: true, message: "Food Added", data: food });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding food" });
  }
};

// ==================== List Food ====================
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching list" });
  }
};

// ==================== Remove Food ====================
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body._id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Optional: remove from Cloudinary
    const publicId = food.imageUrl.split("/").pop().split(".")[0]; // Extract publicId
    await cloudinary.uploader.destroy(`foods/${publicId}`);

    await foodModel.findByIdAndDelete(req.body._id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};

// ==================== Update Food ====================
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    if (name) food.name = name;
    if (description) food.description = description;
    if (price) food.price = price;
    if (category) food.category = category;

    // Handle new image if uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "foods",
        quality: "auto",
        fetch_format: "auto",
      });
      food.imageUrl = result.secure_url;
    }

    await food.save();
    res.json({ success: true, message: "Food updated successfully", data: food });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating food" });
  }
};

// ==================== Add Review ====================
const addReview = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Review text is required" });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    const review = {
      userName: req.user.name || "Anonymous",
      text,
    };

    food.reviews = food.reviews || [];
    food.reviews.push(review);

    await food.save();

    res.json({ success: true, message: "Review added successfully", reviews: food.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== Get Reviews ====================
const getReviews = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.json({ success: true, reviews: food.reviews || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addFood, listFood, removeFood, updateFood, addReview, getReviews };
