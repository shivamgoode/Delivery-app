import express from "express"
import cors from "cors"
import {connectDB} from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import { fileURLToPath } from "url";

// app config
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 4000;
await connectCloudinary();
//middleware
app.use(express.json());
app.use(cors());
//DB connection
connectDB();
//api endpoint
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.get("/", (_, res) => {
  res.send("API WORKING")
})

app.use(express.static(path.join(__dirname, "fe/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "fe/dist", "index.html"));
});

app.listen(port, ()=>{
  console.log(`server started on http://localhost:${port}`);
  
  }
)
//mongodb+srv://shivam68338:1227@cluster0.bgbd2xd.mongodb.net/?
