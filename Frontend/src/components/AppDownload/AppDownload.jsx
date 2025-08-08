import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets.js";
const AppDownload = () => {
  return (
    <div className="app-download-platform" id="app-download">
      <p>
        For Better Experience Download <br />
        Tomato App
      </p>
      <img src={assets.play_store} alt="" />
      <img src={assets.app_store} alt="" />
    </div>
  );
};

export default AppDownload;
