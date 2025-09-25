import "./foodItem.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const FoodItem = ({ id, name, price, description, image }) => {
  // ✅ Provide default empty object for cartItems
  const {
    cartItems = {},
    addToCart,
    removeFromCart,
    url,
  } = useContext(StoreContext);

  // Example fetch function (if needed later)
  const fetchList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");

      if (response.data.data) {
        response.data.data.forEach((item) => {
          const imageUrl = item.imageUrl || item.image;
          console.log(imageUrl);
        });
      } else {
        toast.error("Error fetching food list");
      }

      return response;
    } catch (error) {
      toast.error("Failed to fetch list");
      console.error(error);
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-img" src={image} alt={name} />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
