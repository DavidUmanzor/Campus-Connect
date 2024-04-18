import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './UniversityPage.css';
import Navigation from '../Navigation';
import UniversityImages from '../UniversityImages';
import CreateRSO from '../forms/CreateRSO';
import CreateEvent from '../forms/CreateEvent';

const UniversityPage = () => {
    const { universityId } = useParams();
    const [university, setUniversity] = useState({});
    const [rsos, setRsos] = useState([]);
    const [events, setEvents] = useState([]);
    const [showCreateRsoModal, setShowCreateRsoModal] = useState(false);
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const universityResponse = await fetch(`${API_URL}/universities/${universityId}`);
                const universityData = await universityResponse.json();
                setUniversity(universityData);

                const rsosResponse = await fetch(`${API_URL}/rsos/university/${universityId}`);
                const rsosData = await rsosResponse.json();
                setRsos(rsosData);

                const eventsResponse = await fetch(`${API_URL}/events/university/${universityId}`);
                const eventsData = await eventsResponse.json();
                setEvents(eventsData);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [API_URL, universityId]);

    // Function to toggle the modal
    const handleToggleModal = () => {
        setShowCreateRsoModal(!showCreateRsoModal);
    };

    const handleToggleEventModal = () => {
        setShowCreateEventModal(!showCreateEventModal);
    };

    return (
        <Container className="university-page">
            <Navigation />
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="text-center">
                        <Card.Header as="h2">{university.name}</Card.Header>
                        <UniversityImages pictures={university.pictures} />
                        <Card.Body>
                            <Card.Text>{university.description}</Card.Text>
                            <Card.Text>Location: {university.location}</Card.Text>
                            <Card.Text>Number of Students: {university.number_of_students}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
                            RSOs
                            <Button variant="primary" onClick={handleToggleModal} className="ms-auto">Create RSO</Button>
                        </Card.Header>
                                    
                        <CreateRSO
                            show={showCreateRsoModal}
                            onHide={handleToggleModal}
                            universityId={universityId}
                            onRsoCreated={() => {
                                console.log('RSO Created! Fetching new list...');
                                setShowCreateRsoModal(false);
                            }}
                        />
                        <Card.Body>
                            {rsos.length > 0 ? rsos.map((rso, index) => (
                                <Link to={`/rso/${rso.rso_id}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Card.Text>{rso.name}</Card.Text>
                                </Link>
                            )) : <Card.Text>No RSOs found for this university.</Card.Text>}

                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
                            Events
                            <Button variant="primary" onClick={handleToggleEventModal} className="ms-auto">Create Event</Button>
                        </Card.Header>

                        <CreateEvent
                            show={showCreateEventModal}
                            onHide={handleToggleEventModal}
                            universityId={universityId}
                            onEventCreated={() => {
                                console.log('Event Created! Fetching new list...');
                                setShowCreateEventModal(false);
                            }}
                        />
                        <Card.Body>
                        
                        {events.length > 0 ? events.map((event, index) => {
                            
                            const eventDate = new Date(event.event_date);
                            const formattedDate = eventDate.toLocaleDateString('en-US');
                            const eventTime = new Date('1970-01-01T' + event.event_time + 'Z');
                            const formattedTime = eventTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                            
                            return (
                            <Link to={`/event/${event.event_id}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Card.Text key={index}>
                                <b>{event.name} Hosted By: {event.rso_name || 'University'}</b>
                                <p>{formattedTime} - {formattedDate}</p>
                            </Card.Text>
                            </Link>
                            );
                            
                        }) : <Card.Text>No events found for this university.</Card.Text>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UniversityPage;
