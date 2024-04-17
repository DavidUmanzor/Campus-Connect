import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import './RsoPage.css';
import Navigation from '../Navigation';

const RsoPage = () => {
    const { rsoId } = useParams();
    const [rsoDetails, setRsoDetails] = useState({});
    const [events, setEvents] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRsoActive, setIsRsoActive] = useState(false);
    const [showConfirmLeave, setShowConfirmLeave] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminName, setNewAdminName] = useState('');    
    const [errorMessage, setErrorMessage] = useState('');
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

            // New: Fetch RSO status
            const activeResponse = await fetch(`${API_URL}/rsos/status/${rsoId}`);
            if (activeResponse.ok) {
                const data = await activeResponse.json();
                setIsRsoActive(data); // This field should come from your API
                console.log(data);
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

            // Fetch events only if the RSO is active
            if (isRsoActive) {
                const eventsResponse = await fetch(`${API_URL}/events/rso/${rsoId}`);
                if (eventsResponse.ok) {
                    const eventsData = await eventsResponse.json();
                    setEvents(eventsData.filter(event => event.visibility === 'public' || isMember));
                }
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
        recheckRSOActive();
    };

    const handleCreateEventClick = () => {
        if (!isRsoActive) {
            alert("RSO is not active. RSO requires more people to be an actively registered RSO.");
        } else {
            navigate(`/createEvent/${rsoId}`);
        }
    };

    const handleLeaveRso = async () => {
        if (isAdmin) {
            setShowConfirmLeave(true);
        } else {
        performLeave();
        }
    };

    const handleVerifyAdmin = async () => {
        if (!newAdminEmail) {
            setErrorMessage("Please enter an email address.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/rsos/check-new-admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newAdminEmail, rsoId })
            });
    
            const data = await response.json(); // Attempt to parse JSON regardless of response status
    
            if (response.ok) {
                setNewAdminName(data.name);
                setErrorMessage('');
            } else {
                // Handle different error statuses appropriately
                setErrorMessage(data.message);
                setNewAdminName('');
            }
        } catch (error) {
            console.error("Error verifying new admin:", error);
            setErrorMessage("Failed to fetch or parse response: " + error.message);
            setNewAdminName('');
        }
    };
    

    const handleTransferAdminRole = async () => {
        if (!newAdminName) {
            setErrorMessage("Please verify the new admin's email before confirming the transfer.");
            return;
        }
        const response = await fetch(`${API_URL}/rsos/transfer-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rsoId, oldAdminId: userId, newAdminId: newAdminEmail })
        });
        if (response.ok) {
            alert('Admin role transferred successfully.');
            navigate(`/rso/${rsoId}`);
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message);
        }
    };

    const recheckRSOActive = async () => {
        const activeResponse = await fetch(`${API_URL}/rsos/status/${rsoId}`);
        if (activeResponse.ok) {
            const data = await activeResponse.json();
            setIsRsoActive(data.is_active); // This field should come from your API
        }

        // Fetch events only if the RSO is active
        if (isRsoActive) {
            const eventsResponse = await fetch(`${API_URL}/events/rso/${rsoId}`);
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                setEvents(eventsData.filter(event => event.visibility === 'public' || isMember));
            }
        }
    }

    const performLeave = async () => {
        try {
            const response = await fetch(`${API_URL}/userRsos/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, rsoId }),
            });
            if (response.ok) {
                setIsMember(false);
            } else {
                throw new Error('Failed to leave RSO');
            }
        } catch (error)
        {
            console.error("Error leaving RSO:", error);
        }    
    }

    const confirmLeave = async () => {
        setShowConfirmLeave(false);
        await performLeave();
    };

    return (
        <div className="rso-page">
            <Navigation />
            <Container className="mt-4">
                <Modal show={showConfirmLeave} onHide={() => setShowConfirmLeave(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Admin Transfer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        You are the admin of this RSO. To transfer your admin role, please enter the new admin's email and verify:
                        <input
                            type="email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            placeholder="Enter new admin email"
                            className="form-control my-2"
                        />
                        <Button onClick={handleVerifyAdmin} variant="secondary">Verify Email</Button>
                        {newAdminName && <p className="mt-3">Confirm transfer to: {newAdminName}</p>}
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleTransferAdminRole}>Confirm Transfer</Button>
                        <Button variant="secondary" onClick={() => setShowConfirmLeave(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
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
                                        <Button variant="info" onClick={handleCreateEventClick}>Create Event</Button>
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
                        isRsoActive ? (
                        <p>No events to display.</p>
                        ) : (
                        <p>RSO is not active. RSO requires more people to be an actively registered RSO.</p>)
                    )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RsoPage;