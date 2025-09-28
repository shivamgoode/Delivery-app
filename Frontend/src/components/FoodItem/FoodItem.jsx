import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const FoodItem = ({ id, name, price, description, image }) => {
  const {
    cartItems = {},
    addToCart,
    removeFromCart,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]); // store reviews
  const [newReview, setNewReview] = useState(""); // input state

  // Function to handle "Buy Now" button
  const handleBuyNow = async () => {
    try {
      await addToCart(id); // add item to cart
      navigate("/cart"); // redirect to cart page
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error(err);
    }
  };

  // Fetch reviews for this food item
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${url}/api/reviews/${id}`);
      if (response.data && response.data.reviews) {
        setReviews(response.data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  // Submit new review
  const submitReview = async () => {
    if (!newReview.trim()) {
      toast.error("Please write a review before submitting.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/reviews/${id}`, {
        text: newReview,
      });
      if (response.data.success) {
        setNewReview("");
        fetchReviews(); // refresh reviews
        toast.success("Review submitted!");
      }
    } catch (err) {
      toast.error("Failed to submit review");
      console.error(err);
    }
  };

  // Open modal and fetch reviews
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
          {/* ⭐ Clickable Rating Star (opens review popup) */}
          <img
            src={assets.rating_starts}
            alt="Rating"
            className="review-star"
            onClick={handleOpenReview}
          />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
        {/* Buy Now Button */}
        <button className="buy-now-btn" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>

      {/* Review Modal */}
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

            {/* Review List */}
            <div className="review-list">
              {reviews.length > 0 ? (
                reviews.map((rev, idx) => (
                  <p key={idx} className="review-item">
                    {rev.text}
                  </p>
                ))
              ) : (
                <p>No reviews yet. Be the first!</p>
              )}
            </div>

            {/* Add New Review */}
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review..."
            />
            <button onClick={submitReview} className="submit-review-btn">
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItem;
