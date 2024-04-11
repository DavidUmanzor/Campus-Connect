import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './RsoPage.css';
import Navigation from './Navigation';

const RsoPage = () => {
    const { rsoId } = useParams();
    const [rsoDetails, setRsoDetails] = useState({});
    const [events, setEvents] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // New state to track admin status
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            const rsoResponse = await fetch(`${API_URL}/rsos/${rsoId}`);
            if (rsoResponse.ok) {
                const rsoData = await rsoResponse.json();
                setRsoDetails(rsoData);
            }

            const membershipResponse = await fetch(`${API_URL}/userRsos/checkMembership`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, rsoId }),
            });
            if (membershipResponse.ok) {
                const membershipData = await membershipResponse.json();
                setIsMember(membershipData.isMember);
            }

            const eventsResponse = await fetch(`${API_URL}/events/rso/${rsoId}`);
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                setEvents(eventsData.filter(event => event.visibility === 'public' || isMember));
            }

            // New: Fetch admin status
            const adminResponse = await fetch(`${API_URL}/rsos/admin/${rsoId}?userId=${userId}`);
            if (adminResponse.ok) {
                const adminData = await adminResponse.json();
                setIsAdmin(adminData.isAdmin);
            }
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
                                <Card.Text>Member Count: {rsoDetails.member_count}</Card.Text>
                                <Card.Text>Status: {rsoDetails.is_active ? 'Active' : 'Inactive'}</Card.Text>
                                {isAdmin && (
                                    // Only show if the user is an admin
                                    <div>
                                        <Button variant="info" onClick={() => navigate(`/createEvent/${rsoId}`)}>Create Event</Button>
                                        <Button variant="secondary" onClick={() => navigate(`/editRso/${rsoId}`)}>Edit RSO</Button>
                                    </div>
                                )}
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
                            <Link key={index} to={`/event/${event.event_id}`} style={{ textDecoration: 'none' }}>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{event.name}</Card.Title>
                                        <Card.Text>{event.description}</Card.Text>
                                        {/* Additional event details can go here */}
                                    </Card.Body>
                                </Card>
                            </Link>
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