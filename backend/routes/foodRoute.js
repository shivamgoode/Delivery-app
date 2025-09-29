import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  addReview,
  getReviews,
  updateFood,
} from "../controllers/foodController.js";
import multer from "multer";
import auth from "../middleware/auth.js";

const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.put("/update/:id", upload.single("image"), updateFood);

// ================= Reviews =================
foodRouter.post("/reviews/:foodId", auth, addReview);  // protected
foodRouter.get("/reviews/:foodId", getReviews);        // public

export default foodRouter;
