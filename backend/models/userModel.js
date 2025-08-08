import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name:{type:String, required:true},
  email:{type:String, required:true},
  password:{type:String, required:true},
  cartData:{type:Object, default:{}}, // default value is an empty object
},{minimize:false}) // if the object is empty, it will not be saved in the database

const userModel = mongoose.models.users || mongoose.model("users", userSchema);
export default userModel;