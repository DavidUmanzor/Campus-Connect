import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';

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

const EditEvent = ({ show, onHide, onSave, event }) => {
    const [eventData, setEventData] = useState({
        name: '',
        category: '',
        description: '',
        event_time: '',
        event_date: new Date(),
        location_name: '',
        contact_phone: '',
        contact_email: '',
        visibility: '',
        latitude: 0,
        longitude: 0,
    });

    // Load event data when the component mounts or the event prop changes
    useEffect(() => {
        if (event) {
            setEventData({
                name: event.name || '',
                category: event.category || '',
                description: event.description || '',
                event_time: event.event_time || '',
                event_date: new Date(event.event_date) || new Date(),
                location_name: event.location_name || '',
                contact_phone: event.contact_phone || '',
                contact_email: event.contact_email || '',
                visibility: event.visibility || 'public',
                latitude: parseFloat(event.latitude) || 0,
                longitude: parseFloat(event.longitude) || 0,
            });
        }
    }, [event]);

    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationSelect = (latlng) => {
        setEventData(prev => ({
            ...prev,
            latitude: latlng.lat,
            longitude: latlng.lng
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave(eventData);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                            onChange={handleEventChange}
                            dateFormat="MMMM d, yyyy"
                            wrapperClassName="datePicker"
                        />
                    </Form.Group>
                    {/* Time picker */}
                    <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <TimePicker
                            onChange={handleEventChange}
                            value={eventData.event_time}
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
                    <MapContainer center={[eventData.latitude, eventData.longitude]} zoom={13} style={{ height: '180px' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[eventData.latitude, eventData.longitude]} />
                        <LocationPicker onLocationSelected={handleLocationSelect} />
                    </MapContainer>
                    <Button variant="primary" type="submit">Save Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditEvent;

