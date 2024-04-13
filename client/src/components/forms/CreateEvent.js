import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import './CreateEvent.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationPicker = ({ onLocationSelected }) => {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng);
        },
    });
    return null;
};

const CreateEvent = ({ show, onHide, universityId, onEventCreated }) => {
    const [eventLocation, setEventLocation] = useState(null);
    const [eventData, setEventData] = useState({
        name: '',
        category: '',
        description: '',
        event_time: '',
        event_date: new Date(), // initialized with current date
        location_name: '',
        contact_phone: '',
        contact_email: '',
        visibility: 'public',
    });
    const [eventTime, setEventTime] = useState('10:00'); // initial time
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const userId = localStorage.getItem('userId'); // Assuming this is the ID of the user creating the event

    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationSelect = (latlng) => {
        setEventLocation(latlng);
        setEventData({ ...eventData, latitude: latlng.lat, longitude: latlng.lng });
    };

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/events/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...eventData, event_time: eventTime, created_by: userId, university_id: universityId }),
            });
            if (response.ok) {
                onEventCreated();
                onHide(); // Close modal on successful creation
            } else {
                throw new Error('Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create a New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitEvent}>
                    {/* Name field */}
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter event name"
                            name="name"
                            value={eventData.name}
                            onChange={handleEventChange}
                            required
                        />
                    </Form.Group>
                    {/* Description field */}
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter event description"
                            name="description"
                            value={eventData.description}
                            onChange={handleEventChange}
                            required
                        />
                    </Form.Group>
                    {/* Category field */}
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter event category"
                            name="category"
                            value={eventData.category}
                            onChange={handleEventChange}
                            required
                        />
                    </Form.Group>
                    {/* Date picker */}
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <DatePicker
                            selected={eventData.event_date}
                            onChange={date => setEventData({ ...eventData, event_date: date })}
                            dateFormat="MMMM d, yyyy"
                            wrapperClassName="datePicker"
                        />
                    </Form.Group>
                    {/* Time picker */}
                    <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <TimePicker
                            onChange={setEventTime}
                            value={eventTime}
                            className="timePicker"
                        />
                    </Form.Group>
                    {/* Contact phone field */}
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Phone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter contact phone"
                            name="contact_phone"
                            value={eventData.contact_phone}
                            onChange={handleEventChange}
                        />
                    </Form.Group>
                    {/* Contact email field */}
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter contact email"
                            name="contact_email"
                            value={eventData.contact_email}
                            onChange={handleEventChange}
                            required
                        />
                    </Form.Group>
                    {/* Location name field */}
                    <Form.Group className="mb-3">
                        <Form.Label>Location Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter location name"
                            name="location_name"
                            value={eventData.location_name}
                            onChange={handleEventChange}
                        />
                    </Form.Group>
                    {/* Visibility select field */}
                    <Form.Group className="mb-3">
                        <Form.Label>Visibility</Form.Label>
                        <Form.Select
                            name="visibility"
                            value={eventData.visibility}
                            onChange={handleEventChange}
                            required
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="rso">RSO</option>
                        </Form.Select>
                    </Form.Group>
                    {/* Map picker placeholder */}
                    <Form.Group className="mb-3">
                        <Form.Label>Event Location</Form.Label>
                        <MapContainer
                            center={[28.6024, -81.2001]} // Example center for UCF
                            zoom={13}
                            style={{ height: '180px', marginBottom: '20px' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {eventLocation && <Marker position={eventLocation} />}
                            <LocationPicker onLocationSelected={handleLocationSelect} />
                        </MapContainer>
                        {eventLocation && <p>Location selected: {eventLocation.lat.toFixed(2)}, {eventLocation.lng.toFixed(2)}</p>}
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create Event
                    </Button>
                    <Button variant="secondary" onClick={onHide} style={{ marginLeft: '10px' }}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateEvent;
