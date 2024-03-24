import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Modal, Form } from 'react-bootstrap';
import './UserPage.css'; // Make sure to have this CSS file for styling

const UserPage = () => {
    const [user, setUser] = useState(null);
    const [userRsos, setUserRsos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'email' or 'university'
    const [newEmail, setNewEmail] = useState('');
    const [newUniversityId, setNewUniversityId] = useState('');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchUserAndRsos = async () => {
            try {
                // Fetch user
                let response = await fetch(`${API_URL}/users/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch user');
                let userData = await response.json();
                setUser(userData);

                // Fetch RSOs for the user
                response = await fetch(`${API_URL}/userRsos/user/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch RSOs for user');
                const rsosData = await response.json();
                setUserRsos(rsosData);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUserAndRsos();
    }, [userId, API_URL]);

    const handleDeleteAccount = async () => {
        try {
            await fetch(`${API_URL}/users/delete/${userId}`, { method: 'DELETE' });
            localStorage.removeItem('userId');
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const body = modalType === 'email' ? { email: newEmail } : { university_id: newUniversityId };
        try {
            const response = await fetch(`${API_URL}/users/update/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error('Failed to update user');
            setShowModal(false);
            // Optionally refetch user data here
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="user-page">
            <Navbar bg="light" expand="lg" className="main-navbar">
                <Container fluid>
                    <Navbar.Brand href="/">Campus Connect</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Button variant="outline-primary" onClick={() => navigate('/')}>Main Menu</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Row className="justify-content-center my-4">
                    <Col md={6}>
                        {user ? (
                            <Card>
                                <Card.Header>User Profile</Card.Header>
                                <Card.Body>
                                    <Card.Title>{user.name}</Card.Title>
                                    <Card.Text>Email: {user.email}</Card.Text>
                                    <Card.Text>Role: {user.role}</Card.Text>
                                    {/* University name can be added here if available */}
                                </Card.Body>
                            </Card>
                        ) : <p>Loading user information...</p>}
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Header>RSOs</Card.Header>
                            <Card.Body>
                                {userRsos.length > 0 ? userRsos.map((rso) => (
                                    <Card.Text key={rso.rso_id}>{rso.name}</Card.Text>
                                )) : <Card.Text>You aren't a part of any RSOs.</Card.Text>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-center my-4">
                    <Col md={6}>
                        <Button variant="secondary" onClick={() => { setModalType('email'); setShowModal(true); }}>Change Email</Button>
                        <Button variant="secondary" onClick={() => { setModalType('university'); setShowModal(true); }}>Change University</Button>
                        <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
                    </Col>
                </Row>
            </Container>
            {/* Modal for updating user email or university */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'email' ? 'Change Email' : 'Change University'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateUser}>
                        {modalType === 'email' ? (
                            <Form.Group controlId="formNewEmail">
                                <Form.Label>New Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter new email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                            </Form.Group>
                        ) : (
                            <Form.Group controlId="formNewUniversityId">
                                <Form.Label>New University ID</Form.Label>
                                <Form.Control type="number" placeholder="Enter new university ID" value={newUniversityId} onChange={(e) => setNewUniversityId(e.target.value)} required />
                            </Form.Group>
                        )}
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserPage;
