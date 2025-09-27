import React, { useEffect, useState, useContext } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [discounts, setDiscounts] = useState({});
  const [popupMessage, setPopupMessage] = useState(""); // ✅ popup state

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/orders/userorders",
        {},
        { headers: { token } }
      );
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setData([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // ✅ Apply promo code logic
  const applyPromo = (orderId, amount) => {
    let discount = 0;

    if (promoCode === "ADLER10") {
      discount = amount * 0.1;
    } else if (promoCode === "WELCOME50") {
      discount = 50;
    } else if (promoCode === "FREEDINE") {
      discount = amount;
    } else {
      setPopupMessage("❌ Invalid promo code!");
      return;
    }

    setDiscounts((prev) => ({
      ...prev,
      [orderId]: discount,
    }));

    setPopupMessage(`🎉 Promo applied! You saved ₹${discount.toFixed(2)}`);
  };

  // ✅ Close popup after 3 seconds automatically
  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => setPopupMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {/* ✅ Discount Popup */}
      {popupMessage && (
        <div className="popup-message">
          <p>{popupMessage}</p>
        </div>
      )}

      <div className="container">
        {data.length === 0 && <p>No orders found.</p>}
        {data.map((order, index) => {
          const discount = discounts[order._id] || 0;
          const finalAmount = (order.amount || 0) - discount;

          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="order" />
              <p>
                {Array.isArray(order.items)
                  ? order.items
                      .map((item, idx) =>
                        idx === order.items.length - 1
                          ? `${item.name} x ${item.quantity}`
                          : `${item.name} x ${item.quantity}, `
                      )
                      .join("")
                  : "No items"}
              </p>

              <p>
                Original: ₹{order.amount?.toFixed(2) || "0.00"} <br />
                {discount > 0 && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Discounted: ₹{finalAmount.toFixed(2)}
                  </span>
                )}
              </p>

              <p>Items: {Array.isArray(order.items) ? order.items.length : 0}</p>
              <p>
                <span> &#x25cf; </span>
                <b>{order.status || "Pending"}</b>
              </p>

              {/* Promo code input */}
              <div className="promo-section">
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={() => applyPromo(order._id, order.amount)}>
                  Apply
                </button>
              </div>

              <button onClick={fetchOrders}>Track Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
