import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="footer-logo" src={assets.logo} alt="Logo" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
            fugit similique eligendi. Repellat odio pariatur doloremque totam
            voluptatibus, cumque provident nam, placeat numquam corporis sint
            sapiente earum alias eveniet tenetur!
          </p>
          <div className="footer-social-icon">
            <img className="fb" src={assets.facebook_icon} alt="facebook" />
            <img className="twit" src={assets.twitter_icon} alt="twitter" />
            <img className="link" src={assets.linkedin_icon} alt="lkinkedin" />
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
            <li>+91-7858044746</li>
            <li>shivam68338@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 © Foody.com -All Right Reserved
      </p>
    </div>
  );
};

export default Footer;
