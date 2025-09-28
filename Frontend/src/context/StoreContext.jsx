import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://delivery-app-qqf3.onrender.com";
  const [token, setTokenState] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [food_list, setFoodList] = useState([]);

  const [promoCode, setPromoCode] = useState(""); // stores applied promo code
  const [discount, setDiscount] = useState(0);   // stores current discount

  // ====================== Token ======================
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

  // ====================== Cart ======================
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
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
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
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

  // ====================== Food ======================
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (err) {
      console.error("Fetch food list failed:", err);
      setFoodList([]);
    }
  };

  // ====================== Cart Data ======================
  const loadCartData = async (t) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: t } });
      setCartItems(response.data.cartData || {});
    } catch (err) {
      console.error("Load cart data failed:", err);
      setCartItems({});
    }
  };

  // ====================== Promo Code ======================
  const applyPromoCode = (code) => {
    let discountValue = 0;

    if (code === "ACT15" || code === "BIHAR15") {
      discountValue = getTotalCartAmount() * 0.15;
    } else {
      setDiscount(0);
      setPromoCode("");
      return { success: false, message: "❌ Invalid Promocode" };
    }

    setDiscount(discountValue);
    setPromoCode(code);
    return {
      success: true,
      message: `✅ Promocode applied! You saved ₹${discountValue.toFixed(2)} 🎉`
    };
  };

  const clearPromoCode = () => {
    setPromoCode("");
    setDiscount(0);
  };

  // ====================== Reviews ======================
 const addReview = async (foodId, text) => {
  if (!token) return { success: false, message: "Not authenticated" };
  try {
    const response = await axios.post(
      `${url}/api/reviews/${foodId}`,
      { text },
      { headers: { token } }
    );
    return response.data; // should return { success: true, message: "..."}
  } catch (err) {
    console.error("Add review failed:", err);
    return { success: false, message: "Failed to submit review" };
  }
};

// Get all reviews for a food item
const getReviews = async (foodId) => {
  try {
    const response = await axios.get(`${url}/api/reviews/${foodId}`);
    return response.data.reviews || [];
  } catch (err) {
    console.error("Get reviews failed:", err);
    return [];
  }
};

  // ====================== Load Data ======================
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

  // ====================== Context Value ======================
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
    promoCode,
    discount,
    applyPromoCode,
    clearPromoCode,
    addReview,     // ✅ expose review functions
    getReviews     // ✅ expose review functions
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
