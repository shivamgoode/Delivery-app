import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const auth = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Please login first" });
  }
  try {
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decoded._id; // Attach userId to the request body
    next();
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default auth;
