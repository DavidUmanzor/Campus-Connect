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
                    console.log(commentsData);
                    setComments(Array.isArray(commentsData) ? commentsData : []);
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

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingFormData, setEditingFormData] = useState({ text: '', rating: '' });

    // Function to start editing a comment
    const handleEditComment = (comment) => {
        setEditingCommentId(comment.comment_id);
        setEditingFormData({ text: comment.text, rating: comment.rating });
    };

    // Function to save the edited comment
    const handleSaveEdit = async () => {
        const response = await fetch(`${API_URL}/commentsratings/update/${editingCommentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...editingFormData, user_id: userId, event_id: eventId }),
        });
        if (response.ok) {
            const updatedComment = await response.json();
            setComments(comments.map(comment =>
                comment.comment_id === editingCommentId ? { ...comment, ...updatedComment } : comment
            ));
            setEditingCommentId(null);
        } else {
            console.error('Failed to update comment');
            const errorData = await response.text();
            alert(`Could not update comment: ${errorData}`);
        }
    };

    const [universityId, setUniversityId] = useState(null);
        
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
                                console.log('Event Created! Fetching new list...');
                                setShowEditEventModal(false);
                            }}
                        />
                </Card.Body>
            </Card>

            <Row>
                <Col>
                    <h3>Comments</h3>
                    {comments.map((comment) => (
                    <Card key={comment.comment_id} className="mb-3">
                        <Card.Body>
                            {editingCommentId === comment.comment_id ? (
                                // Edit form for comments
                                <Form>
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            value={editingFormData.text}
                                            onChange={(e) => setEditingFormData({...editingFormData, text: e.target.value})}
                                        />
                                        <Form.Control
                                            type="number"
                                            value={editingFormData.rating}
                                            onChange={(e) => setEditingFormData({...editingFormData, rating: Math.min(Math.max(e.target.value, 1), 5)})}
                                        />
                                        <Button onClick={handleSaveEdit}>Save</Button>
                                        <Button onClick={() => setEditingCommentId(null)}>Cancel</Button>
                                    </Form.Group>
                                </Form>
                            ) : (
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                    <Card.Title>Rating: {comment.rating}</Card.Title>
                                    <Card.Text>{comment.text}</Card.Text>
                                    </div>
                                    {userId == comment.user_id && (
                                        <div>
                                            <Button variant="secondary" onClick={() => handleEditComment(comment)}>Edit</Button>
                                            <Button variant="danger" onClick={() => handleDeleteComment(comment.comment_id)}>Delete</Button>
                                        </div>
                                    )}
                                </Card.Body>
                            )}
                        </Card.Body>
                    </Card>
                ))}
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
                                onChange={(e) => setCommentFormData({ ...commentFormData, rating: Math.min(Math.max(e.target.value, 1), 5) })}
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
