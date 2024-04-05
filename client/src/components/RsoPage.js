import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Navbar, Nav, Button } from 'react-bootstrap';
import './RsoPage.css'; // Make sure you have the CSS for styling
import Navigation from './Navigation';

const RsoPage = () => {
    const { rsoId } = useParams();
    const [rsoDetails, setRsoDetails] = useState({});
    const [events, setEvents] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rsoResponse = await fetch(`${API_URL}/rsos/${rsoId}`);
                if (rsoResponse.ok) {
                    const rsoData = await rsoResponse.json();
                    setRsoDetails(rsoData);
                } else {
                    console.error('Failed to fetch RSO details');
                }
    
                const membershipResponse = await fetch(`${API_URL}/userRsos/checkMembership`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, rsoId }),
                });
                if (membershipResponse.ok) {
                    const membershipData = await membershipResponse.json();
                    setIsMember(membershipData.isMember);
                } else {
                    console.error('Failed to check membership');
                }
    
                const eventsResponse = await fetch(`${API_URL}/events/rso/${rsoId}`);
                if (eventsResponse.ok) {
                    const eventsData = await eventsResponse.json();
                    const visibleEvents = eventsData.filter(event => event.visibility === 'public' || isMember);
                    setEvents(visibleEvents);
                } else {
                    console.error('Failed to fetch events');
                }
            } catch (error) {
                console.error('Fetching data error:', error);
            }
        };
        fetchData();
    }, [rsoId, API_URL, userId]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div className="rso-page">
            <Navigation />
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <Card.Header as="h5">{rsoDetails.name}</Card.Header>
                            <Card.Body>
                                <Card.Text>{rsoDetails.description}</Card.Text>
                                {/* Additional RSO details */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>Events</h3>
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{event.name}</Card.Title>
                                        <Card.Text>{event.description}</Card.Text>
                                        {/* Additional event details */}
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p>No events to display.</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RsoPage;
