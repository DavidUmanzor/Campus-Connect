import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form} from 'react-bootstrap';
import Navigation from '../Navigation';
import './EventPage.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './EventPage.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import EditEvent from '../forms/EditEvent';

// Update the icons if they are not displaying properly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const EventPage = () => {
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState({});
    const [rsoName, setRsoName] = useState('');
    const [comments, setComments] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const userId = localStorage.getItem('userId');
    const [commentFormData, setCommentFormData] = useState({ text: '', rating: 0 });
    const [showEditEventModal, setShowEditEventModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const eventResponse = await fetch(`${API_URL}/events/${eventId}`);
            if (eventResponse.ok) {
                const eventData = await eventResponse.json();
                setEventDetails(eventData);

                if (eventData.rso_id) {
                    const rsoResponse = await fetch(`${API_URL}/rsos/${eventData.rso_id}`);
                    if (rsoResponse.ok) {
                        const rsoData = await rsoResponse.json();
                        setRsoName(rsoData.name);
                        setUniversityId(rsoData.university_id);
                        const adminCheckResponse = await fetch(`${API_URL}/rsos/admin/${eventData.rso_id}?userId=${userId}`);
                        if (adminCheckResponse.ok) {
                            const adminData = await adminCheckResponse.json();
                            setIsAdmin(adminData.isAdmin);
                        }
                    }
                } else {
                    setRsoName('University');
                }

                const commentsResponse = await fetch(`${API_URL}/commentsratings/event/${eventId}`);
                if (commentsResponse.ok) {
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData);
                }
            }
        };
        fetchData();
    }, [API_URL, eventId, userId]);
    
    // Function to toggle the Event creation modal
    const handleToggleEventModal = () => {
        setShowEditEventModal(!showEditEventModal);
    };

    const handleDeleteEvent = async () => {
        await fetch(`${API_URL}/events/delete/${eventId}`, { method: 'DELETE' });
        navigate(-1);
    };

    // Comment Actions
    const handleDeleteComment = async (commentId) => {
        await fetch(`${API_URL}/commentsratings/delete/${commentId}`, { method: 'DELETE' });
        setComments(comments.filter(comment => comment.comment_id !== commentId));
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`${API_URL}/commentsratings/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                event_id: eventId,
                text: commentFormData.text,
                rating: commentFormData.rating
            }),
        });
        if (response.ok) {
            const updatedComments = await response.json();
            setComments([...comments, updatedComments]);
        }
    };

    const [universityId, setUniversityId] = useState(null);
    // Format date and time
    // Create a Date object from the event date and time
    const eventDateTime = new Date(`${eventDetails.event_date}T${eventDetails.event_time}`);

    // Format the time as a string in 12-hour format with AM/PM
    const formattedTime = eventDateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true // Enables 12-hour format; set to false for 24-hour format
    });

    // Format the date as a string in mm-dd-yyyy format
    const formattedDate = eventDateTime.toLocaleDateString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
    });
        
    return (
        <Container className="event-page">
            <Navigation />
            <Card className="mb-3">
                <Card.Header>{eventDetails.name}</Card.Header>
                <Card.Body>
                    <Card.Text>{eventDetails.description}</Card.Text>
                    <Card.Text>Date: {new Date(eventDetails.event_date).toLocaleDateString()}</Card.Text>
                    <Card.Text>Time: {new Date(`1970-01-01T${eventDetails.event_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Card.Text>
                    <Card.Text>Location: {eventDetails.location_name}</Card.Text>


                    {eventDetails.latitude && eventDetails.longitude && (
                        <MapContainer center={[eventDetails.latitude, eventDetails.longitude]} zoom={13} style={{ height: '200px' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[eventDetails.latitude, eventDetails.longitude]} />
                        </MapContainer>
                    )}

                    <Link to={`/rso/${eventDetails.rso_id || ''}`}><Button variant="primary">Back to RSO</Button></Link>
                    {isAdmin && (
                        <div>
                            <Button variant="danger" onClick={handleDeleteEvent}>Delete Event</Button>
                            <Button variant="secondary" onClick={handleToggleEventModal}>Edit Event</Button>
                        </div>
                    )}
                        <EditEvent
                            show={showEditEventModal}
                            onHide={handleToggleEventModal}
                            universityId={universityId}
                            event={eventDetails}
                            onEventCreated={() => {
                                // Add logic here for what happens after an event is created
                                console.log('Event Created! Fetching new list...');
                                setShowEditEventModal(false); // Hide modal after creation
                            }}
                        />
                </Card.Body>
            </Card>

            <Row>
                <Col>
                    <h3>Comments</h3>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <Card.Title>Rating: {comment.rating}</Card.Title>
                                    <Card.Text>{comment.text}</Card.Text>
                                    {userId === comment.user_id && (
                                        <Button variant="danger" onClick={() => handleDeleteComment(comment.comment_id)}>Delete</Button>
                                    )}
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </Col>
            </Row>

            <Row>
                <Col>
                    <h4>Leave a Comment</h4>
                    <Form onSubmit={handleCommentSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={commentFormData.text}
                                onChange={(e) => setCommentFormData({ ...commentFormData, text: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="number"
                                value={commentFormData.rating}
                                onChange={(e) => setCommentFormData({ ...commentFormData, rating: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EventPage;
