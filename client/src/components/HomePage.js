import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./HomePage.css";
import DashboardImage from "../images/study-group-1.jpg";

const HomePage = () => {
    return (
		<Container fluid className="window">
			<Row className="image-display">
				<img src={DashboardImage} alt="Dashboard" className="dashboard-image" />
				<h1 className="page-name">Campus Connect</h1>
				<h2 className="image-caption">Your way of keeping involved and connected with your campus</h2>
			</Row>
			<Row className="content-seperator"></Row>
			<Row className="content-display">
				<Col className="sign-up">
					<button>Get Started</button>
				</Col>
				<Col className="content-text">
					<p>Get Connected with your campus today! See what events are happening at your university.</p>
				</Col>
			</Row>
		</Container>
	)
}

export default HomePage;