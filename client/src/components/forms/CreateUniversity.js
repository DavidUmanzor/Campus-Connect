import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateUniversity = ({ show, onHide, emailDomain, onUniversityCreated }) => {
    const [universityData, setUniversityData] = useState({
        name: '',
        location: '',
        latitude: '',
        longitude: '',
        description: '',
        numberOfStudents: '',
        pictures: [],
        emailDomain: emailDomain
    });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const userId = localStorage.getItem('userId');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUniversityData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPicture = () => {
        setUniversityData(prev => ({ ...prev, pictures: [...prev.pictures, ''] }));
    };

    const handleRemovePicture = (index) => {
        const newPictures = universityData.pictures.filter((_, i) => i !== index);
        setUniversityData(prev => ({ ...prev, pictures: newPictures }));
    };

    const handlePictureChange = (index, value) => {
        const newPictures = [...universityData.pictures];
        newPictures[index] = value;
        setUniversityData(prev => ({ ...prev, pictures: newPictures }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/universities/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...universityData, super_admin_id: userId })
            });
            if (response.ok) {
                onUniversityCreated();
                onHide(); // Close modal on successful creation
            } else {
                throw new Error('Failed to create university');
            }
        } catch (error) {
            console.error('Error creating university:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create a New University</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter university name"
                            name="name"
                            value={universityData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter location"
                            name="location"
                            value={universityData.location}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter latitude"
                            name="latitude"
                            value={universityData.latitude}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter longitude"
                            name="longitude"
                            value={universityData.longitude}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter description"
                            name="description"
                            value={universityData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Number of Students</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter number of students"
                            name="numberOfStudents"
                            value={universityData.numberOfStudents}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {universityData.pictures.map((pic, index) => (
                        <Form.Group className="mb-3" key={index}>
                            <Form.Label>Picture URL {index + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter picture URL"
                                value={pic}
                                onChange={(e) => handlePictureChange(index, e.target.value)}
                            />
                            <Button variant="danger" onClick={() => handleRemovePicture(index)} style={{ marginTop: '5px' }}>
                                Remove
                            </Button>
                        </Form.Group>
                    ))}
                    <Button onClick={handleAddPicture} variant="secondary">Add Picture</Button>
                    <Button variant="primary" type="submit" style={{ marginLeft: '10px' }}>
                        Create University
                    </Button>
                    <Button variant="secondary" onClick={onHide} style={{ marginLeft: '10px' }}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateUniversity;
