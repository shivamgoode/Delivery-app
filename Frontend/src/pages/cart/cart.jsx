import { useContext } from "react";
import "./cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, token } =
    useContext(StoreContext); // ✅ assuming `token` is stored in context for login check
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!token) {
      alert("⚠️ Please login first to proceed to checkout.");
    } else {
      navigate("/placeorder");
    }
  };

  return (
    <div className="cart" id="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Titles</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                  >
                    X
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
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
              <p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p>
            </div>
            <hr />
            <div className="cart-total-detalis">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}
              </b>
            </div>
          </div>
          {/* ✅ Updated button click */}
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-Promocode">
          <div>
            <p>If you have promocode, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Enter Promocode" />
              <button>APPLY</button>
            </div>
          </div>

          {/* ✅ New COD discount message */}
          <p className="cod-discount">
            💡 Order <b>Cash on Delivery</b> for <b>60% discount</b> on delivery
            charge
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
