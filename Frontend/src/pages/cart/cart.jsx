import { useContext, useState } from "react";
import "./cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    token,
    discount,
    promoCode,
    applyPromoCode
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [inputPromo, setInputPromo] = useState(""); // user input
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleCheckout = () => {
    if (!token) {
      alert("⚠️ Please login first to proceed to checkout.");
    } else {
      navigate("/placeorder"); // discount & promoCode are now in context
    }
  };

  const handleApplyPromo = () => {
    const result = applyPromoCode(inputPromo);
    setPopupMessage(result.message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 50;
  const total = subtotal === 0 ? 0 : subtotal + deliveryFee - discount;

  return (
    <div className="cart" id="cart">
      {showPopup && <div className="popup-message">{popupMessage}</div>}

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
        {food_list.map((item) =>
          cartItems[item._id] > 0 ? (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img src={item.imageUrl} alt={item.name} />
                <p>{item.name}</p>
                <p>₹{item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>₹{item.price * cartItems[item._id]}</p>
                <p onClick={() => removeFromCart(item._id)} className="cross">
                  X
                </p>
              </div>
              <hr />
            </div>
          ) : null
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-detalis">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-detalis">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            {discount > 0 && (
              <div className="cart-total-detalis">
                <p>Discount ({promoCode})</p>
                <p>- ₹{discount.toFixed(2)}</p>
              </div>
            )}
            <div className="cart-total-detalis">
              <b>Total</b>
              <b>₹{total}</b>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-Promocode">
          <div>
            <p>If you have promocode, Enter it here</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Enter Promocode"
                value={inputPromo}
                onChange={(e) => setInputPromo(e.target.value)}
              />
              <button onClick={handleApplyPromo}>APPLY</button>
            </div>
          </div>

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
