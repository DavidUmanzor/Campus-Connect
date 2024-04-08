import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './RsoPage.css';
import Navigation from './Navigation';

const RsoPage = () => {
    const { rsoId } = useParams();
    const [rsoDetails, setRsoDetails] = useState({});
    const [events, setEvents] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            // Fetch RSO details
            const rsoResponse = await fetch(`${API_URL}/rsos/${rsoId}`);
            const rsoData = await rsoResponse.json();
            setRsoDetails(rsoData);

            // Check membership
            const membershipResponse = await fetch(`${API_URL}/userRsos/checkMembership`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, rsoId }),
            });
            const membershipData = await membershipResponse.json();
            setIsMember(membershipData.isMember);

            // Fetch events
            const eventsResponse = await fetch(`${API_URL}/events/rso/${rsoId}`);
            const eventsData = await eventsResponse.json();
            const visibleEvents = eventsData.filter(event => event.visibility === 'public' || isMember);
            setEvents(visibleEvents);
        };
        fetchData();
    }, [API_URL, rsoId, userId, isMember]);

    const handleJoinRso = async () => {
        await fetch(`${API_URL}/userRsos/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, rsoId }),
        });
        setIsMember(true);
    };

    const handleLeaveRso = async () => {
        await fetch(`${API_URL}/userRsos/remove`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, rsoId }),
        });
        setIsMember(false);
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
                                {!isMember ? (
                                    <Button variant="primary" onClick={handleJoinRso}>Join RSO</Button>
                                ) : (
                                    <Button variant="danger" onClick={handleLeaveRso}>Leave RSO</Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>Events</h3>
                        {events.length ? (
                            events.map((event, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{event.name}</Card.Title>
                                        <Card.Text>{event.description}</Card.Text>
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