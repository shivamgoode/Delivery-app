import "./FoodDisplay.css";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import FoodItem from "../FoodItem/FoodItem.jsx";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  if (!Array.isArray(food_list) || food_list.length === 0) {
    return (
      <div className="food-display" id="food-display">
        <h2>Top Dishes near you</h2>
        <p>No food items available. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                price={`$${item.price}`}
                description={item.description}
                image={item.image}
                imagerl={item.imageUrl}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
