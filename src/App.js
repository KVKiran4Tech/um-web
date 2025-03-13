import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import './App.css';
import styled from 'styled-components';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Login from './pages/auth/login/Login';
import EmployeeList from './pages/Employee/EmployeeList';
import RiderList from './pages/Employee/RiderList';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  Height: 99vh;
`;

const HeaderContainer = styled.header`
  flex: 0 0 auto; /* Header has fixed height */
  height: 80px;
`;

const Layout = styled.div`
    display: flex;
    flex: 1;
    overflow-y: auto;
    margin-top: 3px;
    min-height: calc(100% - 120px);
    max-height: calc(100% - 120px);
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const FooterContainer = styled.footer`
  flex: 0 0 auto; /* Footer has fixed height */
  height: 20px;
  background-color: #333;
  color: white;
`;

const App = () => {
  const [loggedIn, setloggedIn] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const callbackFunction = (childData) => {
    setloggedIn(childData);
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Router>
      <>
        {loggedIn ? (
          <AppContainer>
            <HeaderContainer>
              <Header isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
            </HeaderContainer>
            <Layout>
              <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse}  />
              <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/employee" element={<EmployeeList />} />
                    <Route path="/rider" element={<RiderList />} />
                  </Routes>
                </main>
              </div>
            </Layout>
            <FooterContainer>
              <Footer />
            </FooterContainer>
          </AppContainer>
        ) : (
          <Routes>
            <Route
              path="auth/login"
              element={<Login parentCallback={callbackFunction} />}
            />
            <Route path="*" element={<Navigate to="auth/login" />} /> {/* Redirect to login */}
          </Routes>
        )}
      </>
    </Router>
  );
};

export default App;
