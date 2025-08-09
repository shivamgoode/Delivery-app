import mongoose  from "mongoose";
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String,  },
  category: { type: String, required: true },
  imageUrl :{
    type: String, required: true
  }

})
const foodModel =mongoose.models.food || mongoose.model("food",foodSchema);
/*This line ensures that you don’t create the same Mongoose model multiple times, which can cause errors in development (especially with hot reloading).

mongoose.models.food checks if a model named "food" already exists. If it does, it uses that existing model.
If it doesn’t exist, mongoose.model("food", foodSchema) creates a new model named "food" using the provided foodSchema.
In summary:*/
export default foodModel;