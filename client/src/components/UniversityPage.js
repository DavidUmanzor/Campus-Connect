import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Navbar, Nav, Button } from 'react-bootstrap';
import './UniversityPage.css';
import Navigation from './Navigation';

const UniversityPage = () => {
    const { universityId } = useParams();
    const [university, setUniversity] = useState({});
    const [rsos, setRsos] = useState([]);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch university details
                const universityResponse = await fetch(`${API_URL}/universities/${universityId}`);
                if (!universityResponse.ok) {
                    throw new Error('Failed to fetch university details');
                }
                const universityData = await universityResponse.json();
                setUniversity(universityData);

                // Fetch RSOs associated with the university
                const rsosResponse = await fetch(`${API_URL}/rsos/university/${universityId}`);
                const rsosData = await rsosResponse.json();
                setRsos(rsosData);

                // Fetch events associated with the university
                const eventsResponse = await fetch(`${API_URL}/events/university/${universityId}`);
                const eventsData = await eventsResponse.json();
                setEvents(eventsData);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [API_URL, universityId]);

    const handleLogout = () => {
        localStorage.removeItem('userId'); // Removes userId from localStorage
        navigate('/'); // Navigates to home page
    };

    return (
        <Container className="university-page">
            <Navigation />
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center">
                        <Card.Header as="h2">{university.name}</Card.Header>
                        {university.pictures?.map((pic, index) => (
                            <Image key={index} src={pic} alt="University" fluid />
                        ))}
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
                        <Card.Header as="h4">RSOs</Card.Header>
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
                        <Card.Header as="h4">Events</Card.Header>
                        <Card.Body>
                            {events.length > 0 ? events.map((event, index) => (
                                <Card.Text key={index}>{event.name}</Card.Text>
                            )) : <Card.Text>No events found for this university.</Card.Text>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UniversityPage;
