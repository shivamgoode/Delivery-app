import React, { useEffect, useState, useContext } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

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

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 && <p>No orders found.</p>}
        {data.map((order, index) => (
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
            <p>₹{order.amount?.toFixed(2) || "0.00"}</p>
            <p>Items: {Array.isArray(order.items) ? order.items.length : 0}</p>
            <p>
              <span> &#x25cf; </span>
              <b>{order.status || "Pending"}</b>
            </p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
