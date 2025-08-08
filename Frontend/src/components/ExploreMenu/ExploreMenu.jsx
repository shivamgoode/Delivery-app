import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets.js';
const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className='explore-menu' id="explore-menu">
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>choose from this menu ,our aim to setsfy you in most possible way possible</p>
      <div className="explore-menu-list">
        {menu_list.map((item) => {
          return (
            <div onClick={()=>setCategory(category===item.menu_name ? "All" : item.menu_name)} key={item.menu_name} className='explore-list-item'>
              <img className={category===item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />
              <p className='p'>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr/>
   </div>
  )
}

export default ExploreMenu;
