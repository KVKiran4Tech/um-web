import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color:rgb(206, 206, 206);
  color: black;
  text-align: center;
  padding: 10px 20px;
  position: sticky;
  bottom: 0;
  width: 100%;
`;

const Footer = () => <FooterContainer>&#169; 2025. All rights reserved to United Movers</FooterContainer>;

export default Footer;