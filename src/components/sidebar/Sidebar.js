import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Add styling similar to your sidebar CSS

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/employee', label: 'Employees List', icon: '📊' },
    { path: '/rider', label: 'Riders List', icon: '📊' }
  ];

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <ul className="nav nav-pills flex-column">
        {menuItems.map((item, ind) => (
          <li key={ind} className="nav-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              end
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.label}</span>
            </NavLink>  
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
