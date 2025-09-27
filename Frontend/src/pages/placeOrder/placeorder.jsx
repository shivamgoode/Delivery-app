import React, { useContext, useEffect, useState } from "react";
import "./placeorder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Placeorder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, discount, promoCode } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("online");
  const navigate = useNavigate();

  // ✅ dynamic delivery fee
  const deliveryFee =
    getTotalCartAmount() === 0 ? 0 : paymentMethod === "cod" ? 30 : 50;

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const placeOrderHandler = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryFee - discount, // ✅ use dynamic deliveryFee
      paymentMethod,
    };

    try {
      if (paymentMethod === "online") {
        const response = await axios.post(
          url + "/api/orders/place",
          orderData,
          { headers: { token } }
        );
        if (response.data.success) {
          const { session_url } = response.data;
          // ✅ Stripe checkout redirect
          window.location.replace(session_url);

          // ✅ After successful payment (backend redirect or success hook)
          // For now, also ensure navigation to MyOrders
          setTimeout(() => {
            navigate("/myorders");
          }, 2000); // wait a bit to let Stripe redirect
        } else {
          alert("Something went wrong, please try again later.");
        }
      } else {
        const response = await axios.post(url + "/api/orders/cod", orderData, {
          headers: { token },
        });
        if (response.data.success) {
          alert("✅ Order placed successfully (Cash on Delivery).");
          navigate("/myorders"); // ✅ redirect to MyOrders
        } else {
          alert("❌ Failed to place order. Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Something went wrong while placing order.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrderHandler} className="place-order">
      {/* left side delivery info */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email "
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      {/* right side cart & payment */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-detalis">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-detalis">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-detalis">
              <b>Total</b>
              <b>₹{getTotalCartAmount() + deliveryFee}</b>
            </div>
          </div>

          <div className="payment-method">
            <h3>Choose Payment Method</h3>
            <label>
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online Payment (Stripe)
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery (₹30 delivery fee)
            </label>
          </div>

          <button type="submit">
            {paymentMethod === "online" ? "PROCEED TO PAYMENT" : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Placeorder;
