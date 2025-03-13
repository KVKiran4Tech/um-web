import React from 'react';
import './Header.css';
import logoImage from '../../assets/img/Header_UM_Logo.png';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color:rgb(238, 229, 229);
  padding: 10px;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: row;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = ({ isCollapsed, toggleCollapse }) => (
  <HeaderContainer>
    <div onClick={toggleCollapse} className="menu-button">
      ☰
    </div>
    <div className='divider'>
      |
    </div> 
    <div className='logo'>
      <img src={logoImage} alt="Logo" height='30px' />
    </div>
  </HeaderContainer>
);

export default Header;
