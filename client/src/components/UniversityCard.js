// UniversityCard.js

import React from 'react';
import { Card } from 'react-bootstrap';

const UniversityCard = ({ info }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{info.name}</Card.Title>
        <Card.Text>
          Some quick info about the university.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default UniversityCard;
