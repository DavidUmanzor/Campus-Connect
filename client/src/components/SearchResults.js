// SearchResults.js

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, InputGroup, FormControl, Button, Card } from 'react-bootstrap';
import './SearchResults.css'; // Ensure this CSS file exists and contains the styles you want

const fetchData = async (query) => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    try {
        // Fetch data from all endpoints with the search query
        const universityPromise = fetch(`${baseUrl}/universities/search?query=${encodeURIComponent(query)}`);
        const rsoPromise = fetch(`${baseUrl}/rsos/search?query=${encodeURIComponent(query)}`);
        const eventPromise = fetch(`${baseUrl}/events/search?query=${encodeURIComponent(query)}`);

        // Resolve all promises
        const [universitiesResponse, rsosResponse, eventsResponse] = await Promise.all([
        universityPromise, rsoPromise, eventPromise
        ]);

        // Check if all responses are okay
        if (!universitiesResponse.ok || !rsosResponse.ok || !eventsResponse.ok) {
            throw new Error('HTTP error while fetching data');
        }

        // Extract JSON data from the responses
        const universitiesData = await universitiesResponse.json();
        const rsosData = await rsosResponse.json();
        const eventsData = await eventsResponse.json();

        // Combine data into one object
        return {
            universities: universitiesData,
            rsos: rsosData,
            events: eventsData
        };
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return { universities: [], rsos: [], events: [] }; // Return empty objects in case of error
    }
};
  
const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('query') || '');
    const [results, setResults] = useState({ universities: [], rsos: [], events: [] });
  
    // Call this function when the search button is clicked
    const fetchResults = async () => {
      const data = await fetchData(searchQuery);
      setResults(data);
    };
  
    // Update the URL and fetch results when the search button is clicked
    const handleSearch = () => {
      navigate(`/searchresults?query=${encodeURIComponent(searchQuery)}`);
      fetchResults();
    };
  
    const handleSearchInputChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
    // Search when "Enter" is pressed within the search input
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };
  
    return (
      <Container fluid>
        <Row className="my-4">
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <InputGroup>
              <FormControl
                placeholder="Search for events, universities, RSOs..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
              />
              <Button variant="outline-primary" onClick={handleSearch}>Search</Button>
            </InputGroup>
          </Col>
        </Row>
        {/* Render Universities */}
        <Row>
          <Col>
            <h3>Universities</h3>
            {results.universities.length > 0 ? (
              results.universities.map((university) => (
                <Card key={university.university_id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{university.name}</Card.Title>
                    <Card.Text>{university.description}</Card.Text>
                    {/* Add more university details here */}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No universities found matching your search.</p>
            )}
          </Col>
        </Row>
        {/* Render RSOs */}
        <Row>
          <Col>
            <h3>Registered Student Organizations (RSOs)</h3>
            {results.rsos.length > 0 ? (
              results.rsos.map((rso) => (
                <Card key={rso.rso_id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{rso.name}</Card.Title>
                    <Card.Text>{rso.description}</Card.Text>
                    {/* Add more RSO details here */}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No RSOs found matching your search.</p>
            )}
          </Col>
        </Row>
        {/* Render Events */}
        <Row>
          <Col>
            <h3>Events</h3>
            {results.events.length > 0 ? (
              results.events.map((event) => (
                <Card key={event.event_id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{event.name}</Card.Title>
                    <Card.Text>{event.description}</Card.Text>
                    {/* Add more event details here */}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No events found matching your search.</p>
            )}
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default SearchResults;