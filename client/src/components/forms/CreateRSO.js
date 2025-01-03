import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateRSO = ({ show, onHide, universityId, onRsoCreated }) => {
    const [rsoData, setRsoData] = useState({ name: '', description: '' });
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const userId = localStorage.getItem('userId');

    const handleRsoChange = (e) => {
        const { name, value } = e.target;
        setRsoData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitRso = async (e) => {
        e.preventDefault();
        try {
            const createResponse = await fetch(`${API_URL}/rsos/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...rsoData, admin_id: userId, university_id: universityId })
            });
    
            if (createResponse.ok) {
                const rso = await createResponse.json();
                // Once the RSO is created, update the user's role to 'admin'
                const updateRoleResponse = await fetch(`${API_URL}/users/updateRole`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, role: 'admin' })
                });
    
                if (updateRoleResponse.ok) {
                    onRsoCreated();
                    onHide();
                } else {
                    
                    throw new Error('RSO created, but failed to update user role to admin.');
                }
            } else {
               
                throw new Error('Failed to create RSO');
            }
        } catch (error) {
            console.error('Error creating RSO or updating role:', error);
            alert(error.message);
        }
    };
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create a New RSO</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitRso}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter RSO name"
                            name="name"
                            value={rsoData.name}
                            onChange={handleRsoChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter RSO description"
                            name="description"
                            value={rsoData.description}
                            onChange={handleRsoChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create RSO
                    </Button>
                    <Button variant="secondary" onClick={onHide} style={{ marginLeft: '10px' }}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateRSO;
