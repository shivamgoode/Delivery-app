import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import 'dotenv/config';

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //checking if user exists
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    //compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
}
//create token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, )
}
  

//register user
const registerUser = async (req, res) => {
const { name, password,email } = req.body
 try{
  //checking if user already exists
  const exist = await userModel.findOne({
    $or: [{ email: email }, { password: password }]
  });
  if(exist){
    return res.json({success:false,message:"User already exists"})
 }
 // validating email format and strong password
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email address" });
  }
  if (!password || password.length < 8) {
    return res.json({ success: false, message: "please enter a strong password " });
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new userModel({
    name:name,
    email:email,
    password: hashedPassword
  });

  const user = await newUser.save();
  const token = createToken(user._id);
  res.json({
    success: true,token})
} catch(error){
  console.log(error);
  res.json({ success: false, message: "Internal server error" });
  
}
}


export { loginUser, registerUser };