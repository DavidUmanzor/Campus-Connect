// MainPage.js

import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, InputGroup, FormControl, Button, Navbar, Nav } from 'react-bootstrap';
import './MainPage.css';
import campusImage from '../../images/university-campus-1.jpg';
import Navigation from '../Navigation';
import UniversityCard from '../UniversityCard';

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [universityInfo, setUniversityInfo] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  
  useEffect(() => {
    const fetchUniversityInfo = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`${API_URL}/university/user/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setUniversityInfo(data);
          }
        } catch (error) {
          console.error('Failed to fetch university info:', error);
        }
      }
    };

    fetchUniversityInfo();
  }, []);

  const handleSearch = () => {
    navigate(`/searchresults?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="main-page">
      <Navigation />
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
        {universityInfo && <UniversityCard info={universityInfo} />}
    </div>
  );
};

export default MainPage;
