import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faFemale } from '@fortawesome/free-solid-svg-icons';
import './css//Header.css'; // import the CSS file for styling

import viteLogo from '/vite.svg';

// const Header = ({ userAvatar }) => {
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        {/* Placeholder for the company logo */}
        <img src={viteLogo} alt="Company Logo" />
        <span>Football.com</span>
      </div>
      <div className="header-icons">
        {/* User avatar */}
        <div className="user-avatar">
          <img src={viteLogo} alt="User Avatar" className="avatar" />
        </div>
      </div>
    </header>
  );
};

export default Header;
