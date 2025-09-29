import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FoodItem = ({ id, name, price, description, image }) => {
  const {
    cartItems = {},
    addToCart,
    removeFromCart,
    addReview,
    getReviews,
    token
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  const handleBuyNow = async () => {
    try {
      await addToCart(id);
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getReviews(id);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) {
      toast.error("Please write a review before submitting.");
      return;
    }
    if (!token) {
      toast.error("You must be logged in to submit a review");
      return;
    }
    try {
      const response = await addReview(id, newReview);
      if (response.success) {
        setNewReview("");
        fetchReviews();
        toast.success("Review submitted!");
      } else {
        toast.error(response.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Failed to submit review");
      console.error(err);
    }
  };

  const handleOpenReview = () => {
    setShowReviewModal(true);
    fetchReviews();
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
          <img
            src={assets.rating_starts}
            alt="Rating"
            className="review-star"
            onClick={handleOpenReview}
          />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
        <button className="buy-now-btn" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>

      {showReviewModal && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <button
              className="close-btn"
              onClick={() => setShowReviewModal(false)}
            >
              &times;
            </button>
            <h3>Reviews for {name}</h3>

            <div className="review-list">
              {reviews.length > 0 ? (
                reviews.map((rev, idx) => (
                  <p key={idx} className="review-item">
                    <strong>{rev.userName || "Anonymous"}:</strong> {rev.text}
                  </p>
                ))
              ) : (
                <p>No reviews yet. Be the first!</p>
              )}
            </div>

            <form onSubmit={submitReview}>
              <label htmlFor={`review-${id}`} className="review-label">
                Your Review
              </label>
              <textarea
                id={`review-${id}`}
                name="review"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review..."
                autoComplete="off"
              />
              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
