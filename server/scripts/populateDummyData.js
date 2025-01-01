const pool = require("../db");
const bcrypt = require("bcrypt");
require("dotenv").config();

const populateDummyData = async () => {
	// Truncate all tables and reset primary keys
	await pool.query(
		`TRUNCATE TABLE commentsratings, events, user_rsos, rsos, users, universities RESTART IDENTITY CASCADE;`
	);

	try {
		// Insert universities and assign admins
		const hashedPassword1 = await bcrypt.hash("admin123", 10);
		const hashedPassword2 = await bcrypt.hash("admin456", 10);

		const universities = await pool.query(`
			INSERT INTO universities (name, location, latitude, longitude, description, number_of_students, email_domain) 
			VALUES 
			('University of Central Florida', 'Orlando, FL', 28.60197, -81.20037, 'UCF is one of the largest universities in the U.S.', 70000, 'ucf.edu'),
			('University of Florida', 'Gainesville, FL', 29.65163, -82.32483, 'UF is a top-ranked university in Florida.', 52000, 'ufl.edu')
			RETURNING *;
		`);

		const users = await pool.query(`
			INSERT INTO users (name, email, password, role, university_id) 
			VALUES 
			('UCF Admin', 'admin@ucf.edu', '${hashedPassword1}', 'admin', 1),
			('UF Admin', 'admin@ufl.edu', '${hashedPassword2}', 'admin', 2),
			('John Doe', 'john@ucf.edu', '${await bcrypt.hash(
				"password1",
				10
			)}', 'student', 1),
			('Jane Smith', 'jane@ufl.edu', '${await bcrypt.hash(
				"password2",
				10
			)}', 'student', 2),
			('Bob Johnson', 'bob@ucf.edu', '${await bcrypt.hash(
				"password3",
				10
			)}', 'student', 1),
			('Alice White', 'alice@ufl.edu', '${await bcrypt.hash(
				"password4",
				10
			)}', 'student', 2),
			('Charlie Brown', 'charlie@ucf.edu', '${await bcrypt.hash(
				"password5",
				10
			)}', 'student', 1),
			('Diana Prince', 'diana@ufl.edu', '${await bcrypt.hash(
				"password6",
				10
			)}', 'student', 2)
			RETURNING *;
		`);

		// Insert RSOs
		const rsos = await pool.query(`
			INSERT INTO rsos (name, description, admin_id, university_id, is_active) 
			VALUES 
			('Chess Club', 'A club for chess enthusiasts.', 1, 1, TRUE),
			('Programming Club', 'Coding, programming, and more.', 2, 2, FALSE),
			('Gaming Society', 'For all gaming enthusiasts.', 3, 1, TRUE),
			('Book Club', 'Book lovers unite!', 4, 2, FALSE)
			RETURNING *;
		`);

		// Insert User-RSO memberships (active/inactive logic)
		await pool.query(`
			INSERT INTO user_rsos (user_id, rso_id) 
			VALUES 
			(3, 1), (5, 1), (7, 1), (8, 1), (6, 1), -- Chess Club (5 members = Active)
			(4, 2), (8, 2), (5, 2); -- Programming Club (3 members = Inactive)
		`);

		// Insert events
		const events = await pool.query(`
			INSERT INTO events (name, category, description, event_time, event_date, location_name, latitude, longitude, contact_phone, contact_email, visibility, created_by, university_id, rso_id) 
			VALUES 
			('Chess Tournament', 'Competition', 'A chess competition for all levels.', '14:00', '2024-01-15', 'Library Room A', 28.60197, -81.20037, '123-456-7890', 'events@ucf.edu', 'rso', 1, 1, 1),
			('Programming Hackathon', 'Workshop', 'A full-day programming workshop.', '09:00', '2024-02-20', 'Tech Center', 29.65163, -82.32483, '987-654-3210', 'events@ufl.edu', 'public', 2, 2, 2),
			('Gaming Night', 'Social', 'A fun night of gaming.', '18:00', '2024-03-10', 'Student Lounge', 28.60197, -81.20037, '555-555-5555', 'events@gaming.com', 'rso', 3, 1, 3),
			('Book Club Discussion', 'Meeting', 'Discussing the latest book.', '16:00', '2024-03-12', 'Library', 29.65163, -82.32483, '444-444-4444', 'events@bookclub.com', 'rso', 4, 2, 4)
			RETURNING *;
		`);

		// Insert comments/ratings
		await pool.query(`
			INSERT INTO commentsratings (user_id, event_id, text, rating) 
			VALUES 
			(3, 1, 'Great event!', 5),
			(5, 1, 'It was fun.', 4),
			(7, 2, 'Very informative.', 5),
			(6, 3, 'Loved it!', 5),
			(4, 4, 'Great discussion!', 4);
		`);

		console.log("Dummy data inserted successfully!");
	} catch (err) {
		console.error("Error inserting dummy data:", err);
	} finally {
		pool.end();
	}
};

populateDummyData();
