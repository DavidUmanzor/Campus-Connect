import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, InputGroup, FormControl, Button, Card } from 'react-bootstrap';
import './SearchResults.css';
import Navigation from '../Navigation';

const fetchData = async (query, userId) => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    try {

        const searchEndpoint = query ? `/search?query=${encodeURIComponent(query)}` : '/all';

        const universityPromise = fetch(`${baseUrl}/universities${searchEndpoint}`);
        const rsoPromise = fetch(`${baseUrl}/rsos${searchEndpoint}`);

        const eventEndpoint = query ? searchEndpoint : `/events/allowed?userId=${userId}`;
        const eventPromise = fetch(`${baseUrl}${eventEndpoint}`);

        const [universitiesResponse, rsosResponse, eventsResponse] = await Promise.all([universityPromise, rsoPromise, eventPromise]);

        if (!universitiesResponse.ok || !rsosResponse.ok || !eventsResponse.ok) {
            throw new Error('One or more requests failed');
        }

        const universitiesData = await universitiesResponse.json();
        const rsosData = await rsosResponse.json();
        const eventsData = await eventsResponse.json();

        return {
            universities: universitiesData,
            rsos: rsosData,
            events: eventsData
        };
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return { universities: [], rsos: [], events: [] };
    }
};

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('query') || '');
    const [results, setResults] = useState({ universities: [], rsos: [], events: [] });
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (searchQuery) {
            fetchData('', userId).then(data => setResults(data));
        }
    }, [userId]);

    const handleSearchInputChange = e => setSearchQuery(e.target.value);

    const handleSearch = () => {
    navigate(`/searchresults?query=${encodeURIComponent(searchQuery)}`);
    fetchData(searchQuery, userId).then(data => setResults(data));
};

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-results-page">
            <Navigation />
            <Container fluid className="mt-4">
                <Row className="justify-content-md-center">
                    <Col xs={12} md={8} lg={6}>
                        <InputGroup>
                            <FormControl
                                placeholder="Search for events, universities, RSOs..."
                                aria-label="Search"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onKeyPress={handleKeyPress}
                            />
                            <Button variant="outline-primary" onClick={handleSearch}>Search</Button>
                        </InputGroup>
                    </Col>
                </Row>
                {/* Render sections for universities, rsos, and events */}
                <Row className="mt-4">
                    {/* Universities */}
                    <Col xs={12}>
                        <h3>Universities</h3>
                        {results.universities.length ? results.universities.map(university => (
                            <Link to={`/university/${university.university_id}`} key={university.university_id} className="text-decoration-none">
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{university.name}</Card.Title>
                                        <Card.Text>{university.description}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        )) : <p>No universities found.</p>}
                    </Col>
                </Row>
                <Row>
                    {/* RSOs */}
                    <Col xs={12}>
                        <h3>RSOs</h3>
                        {results.rsos.length ? results.rsos.map(rso => (
                            <Link to={`/rso/${rso.rso_id}`} key={rso.rso_id} className="text-decoration-none">
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{rso.name}</Card.Title>
                                        <Card.Text>{rso.description}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        )) : <p>No RSOs found.</p>}
                    </Col>
                </Row>
                <Row>
                    {/* Events */}
                    <Col xs={12}>
                        <h3>Events</h3>
                        {results.events.length ? results.events.map(event => (
                            <Card key={event.event_id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{event.name}</Card.Title>
                                    <Card.Text>{event.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        )) : <p>No events found.</p>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SearchResults;
