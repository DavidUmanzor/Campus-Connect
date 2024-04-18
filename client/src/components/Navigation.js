// Navigation.js

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

const Navigation = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand href="/">Campus Connect</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/mainpage" className="nav-link">Home</Link>
                        <Link to="/user" className="nav-link">User Profile</Link>
                        <Link to="/searchresults" className="nav-link">Search</Link>
                        {/* more links */}
                    </Nav>
                    <Button variant="danger" onClick={handleLogout}>Log Out</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
