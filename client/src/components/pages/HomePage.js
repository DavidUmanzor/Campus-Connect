// HomePage.js

import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./HomePage.css";
import DashboardImage from "../../images/study-group-1.jpg";

import SignUp from "../forms/SignUp";
import Login from "../forms/Login";

const HomePage = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);

	const handleGetStartedClick = () => {
		setShowLogin(true);
	};

	const handleClose = () => {
		setShowLogin(false);
		setShowSignUp(false);
	};

	const switchToSignUp = () => {
		setShowLogin(false);
		setShowSignUp(true);
	};

	const switchToLogin = () => {
		setShowSignUp(false);
		setShowLogin(true);
	};

    return (
		<Container fluid className="window">
			<Row className="image-display">
				<img src={DashboardImage} alt="Dashboard" className="dashboard-image" />
				<h1 className="page-name">Campus Connect</h1>
			</Row>
			<Row className="content-seperator"></Row>
			<Row className="content-display">
				<Col className="sign-up">
					<button onClick={handleGetStartedClick}>Get Started</button>
				</Col>
				<Col className="content-text">
					<p>Get Connected with your campus today! See what events are happening at your university.</p>
				</Col>
			</Row>
			{showLogin && <Login onSignUpClick={switchToSignUp} onClose={handleClose} />}
     		{showSignUp && <SignUp onLoginClick={switchToLogin} onClose={handleClose} />}
		</Container>
	)
}

export default HomePage;