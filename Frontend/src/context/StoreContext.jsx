import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://delivery-app-qqf3.onrender.com";
  const [token, setTokenState] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [food_list, setFoodList] = useState([]);

  // Handle token safely
  const setToken = (t) => {
    setTokenState(t);
    if (t) {
      localStorage.setItem("token", t);
      setLoggedOut(false);
    } else {
      localStorage.removeItem("token");
      setLoggedOut(true);
    }
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Add to cart failed:", err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCount = prev[itemId] - 1;
      return {
        ...prev,
        [itemId]: newCount > 0 ? newCount : 0,
      };
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Remove from cart failed:", err);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (err) {
      console.error("Fetch food list failed:", err);
      setFoodList([]);
    }
  };

  const loadCartData = async (t) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: t } }
      );
      setCartItems(response.data.cartData || {}); // ✅ ensure it's always an object
    } catch (err) {
      console.error("Load cart data failed:", err);
      setCartItems({});
    }
  };

  // Load data on app start
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken && !loggedOut) {
        setTokenState(savedToken);
        await loadCartData(savedToken);
      }
    };

    loadData();
  }, [loggedOut]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
