// MainPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, InputGroup, FormControl, Button, Navbar } from 'react-bootstrap';
import './MainPage.css'; // Ensure your CSS file is correctly linked
import campusImage from '../images/university-campus-1.jpg'; // Update with the correct path to your image

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/searchresults?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="main-page">
      <Navbar bg="light" expand="lg" className="main-navbar">
        <Container fluid>
          <Navbar.Brand href="#">Campus Connect</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button variant="outline-primary">Menu</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="search-container">
        <InputGroup className="search-input-group">
          <FormControl
            placeholder="Search for events, universities, RSOs..."
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="primary" onClick={handleSearch}>Search</Button>
        </InputGroup>
      </div>
      <div className="image-container">
        <img src={campusImage} alt="Campus" className="campus-image" />
        <div className="image-caption">Keep up to Date on Latest Events!</div>
      </div>
    </div>
  );
};

export default MainPage;
