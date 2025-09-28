import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import { fileURLToPath } from "url";
import path from "path";
import 'dotenv/config';

// ES Module __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App setup
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/food", foodRouter);
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// Root API check
app.get("/", (_, res) => {
  res.send("API WORKING");
});

// Serve React frontend (Vite build)
app.use(express.static(path.join(__dirname, "fe/dist")));

// Catch-all for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "fe/dist", "index.html"));
});

// Start server with async tasks
const startServer = async () => {
  try {
    await connectCloudinary(); // Cloudinary init
    await connectDB();         // Connect to MongoDB

    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
