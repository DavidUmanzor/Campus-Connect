import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import Navigation from './Navigation';
import './EventPage.css';

const EventPage = () => {
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState({});
    const [comments, setComments] = useState([]);
    const [commentFormData, setCommentFormData] = useState({ text: '', rating: '' });
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const userId = localStorage.getItem('userId');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch event details first
                const eventResponse = await fetch(`${API_URL}/events/${eventId}`);
                if (eventResponse.ok) {
                    const eventData = await eventResponse.json();
                    setEventDetails(eventData);
    
                    // Now that you have event data, you can fetch comments and check admin status
                    const commentsResponse = await fetch(`${API_URL}/commentsratings/event/${eventId}`);
                    const adminResponse = await fetch(`${API_URL}/rsos/admin/${eventData.rso_id}?userId=${userId}`);
    
                    if (commentsResponse.ok) {
                        const commentsData = await commentsResponse.json();
                        setComments(commentsData);
                    } else {
                        console.error('Failed to fetch comments');
                    }
    
                    if (adminResponse.ok) {
                        const adminData = await adminResponse.json();
                        setIsAdmin(adminData.isAdmin);
                    } else {
                        console.error('Failed to check admin status');
                    }
                } else {
                    console.error('Failed to fetch event details');
                }
            } catch (error) {
                console.error('Fetching data error:', error);
            }
        };
        fetchData();
    }, [API_URL, eventId, userId]); // Remove eventDetails.rso_id from dependencies to avoid re-fetching when eventDetails changes
    

    const handleDeleteEvent = async () => {
        try {
            await fetch(`${API_URL}/events/delete/${eventId}`, {
                method: 'DELETE',
            });
            navigate(`/rso/${eventDetails.rso_id}`); // Redirect user after deleting the event
        } catch (error) {
            console.error('Error deleting event', error);
        }
    };
    

    const handleCommentSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        // Assume userId is available in your context
        const userId = localStorage.getItem('userId'); // Or however you're managing user state
    
        try {
            await fetch(`${API_URL}/commentsratings/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...commentFormData,
                    user_id: userId,
                    event_id: eventId,
                }),
            });
            setCommentFormData({ text: '', rating: '' }); // Reset form data
            // Refetch comments to update the list
            const updatedCommentsResponse = await fetch(`${API_URL}/commentsratings/event/${eventId}`);
            const updatedCommentsData = await updatedCommentsResponse.json();
            setComments(updatedCommentsData);
        } catch (error) {
            console.error('Failed to submit comment', error);
        }
    };
    
    const handleDeleteComment = async (commentId) => {
        try {
            await fetch(`${API_URL}/commentsratings/delete/${commentId}`, {
                method: 'DELETE',
            });
            // Filter out the deleted comment from the state without needing to refetch all comments
            setComments(comments.filter(comment => comment.comment_id !== commentId));
        } catch (error) {
            console.error('Error deleting comment', error);
        }
    };
    
    return (
        <div className="event-page">
            <Navigation />
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <Card.Header as="h5">{eventDetails.name}</Card.Header>
                            <Card.Body>
                                <Card.Text>{eventDetails.description}</Card.Text>
                                {/* Display more event details here */}
                                <Card.Text>Date: {eventDetails.event_date}</Card.Text>
                                <Card.Text>Time: {eventDetails.event_time}</Card.Text>
                                <Card.Text>Location: {eventDetails.location_name}</Card.Text>
                                {/* Navigate back to RSO page or any other desired location */}
                                <Link to={`/rso/${eventDetails.rso_id}`}><Button variant="primary">Back to RSO</Button></Link>
                                {isAdmin && (
                                    <div>
                                        <Button variant="danger" onClick={handleDeleteEvent}>Delete Event</Button>
                                        <Button variant="secondary" onClick={() => navigate(`/editEvent/${eventId}`)}>Edit Event</Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* Display existing comments */}
                <Row>
                    <Col>
                        <h3>Comments</h3>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Rating: {comment.rating}</Card.Title>
                                        <Card.Text>{comment.text}</Card.Text>
                                        {userId === comment.user_id.toString() && (
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

                {/* Form for submitting new comments */}
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
        </div>
    );
};

export default EventPage;
