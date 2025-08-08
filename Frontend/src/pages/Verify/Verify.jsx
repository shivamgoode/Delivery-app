import "./Verify.css";
import { useSearchParams } from "react-router-dom.jsx";
import axios from "axios";

import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/orders/verify", {
        orderId,
        success,
      });

      if (response.data.success) {
        navigate("/myorders");
      } else {
      }
    } catch (error) {
      console.error("Verification failed:", error);
      navigate("/");
    }
  };
  useEffect(() => {
    verifyPayment();
  }, []);
  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
