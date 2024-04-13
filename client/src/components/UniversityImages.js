import React from 'react';
import { Carousel } from 'react-bootstrap';

const UniversityImages = ({ pictures }) => {
    if (!pictures || pictures.length === 0) {
        return null; // No pictures to display
    }

    return (
        <Carousel>
            {pictures.map((picUrl, index) => (
                <Carousel.Item key={index} interval={3000}>
                    <img
                        className="d-block w-100"
                        src={picUrl}
                        alt={`Slide ${index + 1}`}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default UniversityImages;
