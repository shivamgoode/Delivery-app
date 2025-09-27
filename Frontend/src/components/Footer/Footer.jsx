import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Logo" />
          <p>
            We promise to serve only the freshest ingredients in every dish,
            ensuring that each meal is crafted with care and attention to
            detail. At the heart of our service, quality and taste are our top
            priorities, because we believe that every bite should bring delight.
            Your satisfaction drives us to maintain excellence in everything we
            prepare, delivering meals that are consistently delicious and
            wholesome.
          </p>
          <div className="footer-social-icon">
            <img className="fb" src={assets.facebook_icon} alt="facebook" />
            <img className="twit" src={assets. whatsapp} alt="whatsapp" />

            {/* ✅ Instagram Icon Redirect to WhatsApp */}
            <a
              href="https://wa.me/916206322775"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="link" src={assets.ig} alt="instagram" />
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>
              <a href="tel:+916206322775">+91-6206322775</a>
            </li>
            <li>
              <a href="mailto:senadler1973@gmail.com">senadler1973@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 © Adler.com - All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;

