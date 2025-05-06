import React, { useState, useEffect, useRef } from 'react';
import { FaPizzaSlice } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/SideMenu.css';

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef(null);

  const handleToggleMenu = () => {
    if (isOpen) {
      // Start closing animation
      setClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setClosing(false);
      }, 600); // match this to your animation duration
    } else {
      setIsOpen(true);
    }
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      if (isOpen) {
        handleToggleMenu();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div className="dashboard-container">
      <div className={`side-menu ${isOpen ? "open" : ""} ${closing ? "closing" : ""}`} ref={menuRef}>
        <ul className="menu-items">
          <li><Link to="/profile" className="menu-item">Profile</Link></li>
          <li><Link to="/order-history" className="menu-item">My Orders</Link></li>
          <li><Link to="/build" className="menu-item">Build Pizza</Link></li>
          <li><Link to="/logout" className="menu-item">Logout</Link></li>
          <Link to="/cart" className="menu-item">Go to Cart</Link>
        </ul>
      </div>

      <div className={`menu-icon ${isOpen ? "rotate" : ""}`} onClick={handleToggleMenu}>
        <FaPizzaSlice size={36} color="#ff6347" />
      </div>
    </div>
  );
};

export default SideMenu;
