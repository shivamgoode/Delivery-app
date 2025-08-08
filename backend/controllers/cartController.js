import userModel from '../models/userModel.js';


// Add item to user cart
const addToCart = async (req, res) => {
try{
  let userData = await userModel.findById(req.body.userId);
  let cartData = await userData.cartData;
  if(!cartData[req.body.itemId]){
    cartData[req.body.itemId] = 1;

  }
  else{
    cartData[req.body.itemId] += 1;
  }
  await userModel.findByIdAndUpdate( req.body.userId, {cartData});
   res.json({ success: true, message: "Item added to cart successfully" });
  
}catch (error) {
  console.error("Error adding to cart:", error);
  res.json({ success: false, message: "Internal server error" });
}}


// Remove item from user cart
const removeFromCart = async (req, res) => {
  try{
  let userData = await userModel.findOne({ _id: req.body.userId });
  let cartData = await userData.cartData;
 if(cartData[req.body.itemId]>0){
    cartData[req.body.itemId] -= 1;
 

}
await userModel.findByIdAndUpdate(req.body.userId, { cartData });  
  res.json({ success: true, message: "Item removed from cart successfully" });

  }catch (error) {
  console.error("Error removing from cart:", error);
  res.json({ success: false, message: "Internal server error" });
  }

}

//fetch user cart data
const getCart = async (req, res) => {
  try{
  let userData = await userModel.findById(req.body.userId);
  let cartData = await userData.cartData;
  res.json({ success: true, cartData });
  }catch (error) {
  console.error("Error fetching cart data:", error);
  res.json({ success: false, message: "Internal server error" });
  }
}

export { addToCart, removeFromCart, getCart };