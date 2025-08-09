import foodModel from "../models/foodModel.js"
import fs from 'fs'







// add food item

const addFood = async (req, res) => {
  let image_filename = "";
  if (req.file && req.file.filename) {
    image_filename = req.file.filename;
    console.log(req.file);
  }
  

  // Validate required fields
  const { name, description, price, category } = req.body;
  if (!name || !description || !price || !category) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

 const food= new foodModel({
   name: req.body.name,
   description:req.body.description,
   price:req.body.price,
   category:req.body.category,
   image: image_filename ,
   
  })
  
  try{  

   


      
   await food.save()
    res.json({success:true,message:"Food Added"})
  }catch(error){
console.log(error)
res.json({success:false,message:"Error"})
  }

}

// all food list
const listFood =async(req ,res) =>{
  try{
    const foods = await foodModel.find({}) ;
    res.json({sucssess:true,data:foods})
  }catch(error){
    console.log(error);
    res.json({sucssess: false, message:"Error"})
  }
}

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body._id); //this line is uesd to find the food model using id.
    console.log(req);
    fs.unlink(`uploads/${food.image}`, () => {});  //using this line we can delente the image from the folder
    await foodModel.findByIdAndDelete(req.body._id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

export{addFood,listFood,removeFood}
