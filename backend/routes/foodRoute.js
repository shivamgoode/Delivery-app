import express from "express"
import {addFood,listFood, removeFood, addReview,
  getReviews,} from "../controllers/foodController.js"
import multer from "multer";
import auth from '../middleware/auth.js';


const foodRouter = express.Router();

//Image storage engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`)
  }
})
const upload =multer ({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);
foodRouter.post("/:foodId/reviews", auth, addReview);
foodRouter.get("/:foodId/reviews", getReviews);

export default foodRouter;
