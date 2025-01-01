const pool = require("../db");
require("dotenv").config();

const setupDatabase = async () => {
	try {
		await pool.query(`
      -- Create Universities Table
      CREATE TABLE IF NOT EXISTS universities (
        university_id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        location TEXT,
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        description TEXT,
        number_of_students INT,
        pictures TEXT[], -- Array of image URLs
        email_domain VARCHAR(255) UNIQUE
      );

      -- Create Users Table
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) CHECK (role IN ('student', 'admin', 'superAdmin')),
        university_id INT REFERENCES universities(university_id) ON DELETE SET NULL
      );

      -- Create RSOs Table
      CREATE TABLE IF NOT EXISTS rsos (
        rso_id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        admin_id INT REFERENCES users(user_id) ON DELETE SET NULL,
        university_id INT REFERENCES universities(university_id) ON DELETE CASCADE,
        is_active BOOLEAN DEFAULT FALSE
      );

      -- Create User_RSOs Table
      CREATE TABLE IF NOT EXISTS user_rsos (
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        rso_id INT REFERENCES rsos(rso_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, rso_id)
      );

      -- Create Events Table
      CREATE TABLE IF NOT EXISTS events (
        event_id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        category VARCHAR(50),
        description TEXT,
        event_time TIME,
        event_date DATE,
        location_name VARCHAR(255),
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        contact_phone VARCHAR(20),
        contact_email VARCHAR(255),
        visibility VARCHAR(50) CHECK (visibility IN ('public', 'private', 'rso')),
        created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
        university_id INT REFERENCES universities(university_id) ON DELETE CASCADE,
        rso_id INT REFERENCES rsos(rso_id) ON DELETE CASCADE
      );

      -- Create CommentsRatings Table
      CREATE TABLE IF NOT EXISTS commentsratings (
        comment_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
        text TEXT,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create Trigger Function for RSO Status
      CREATE OR REPLACE FUNCTION update_rso_status()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (TG_OP = 'INSERT') THEN
          UPDATE rsos
          SET is_active = TRUE
          WHERE rso_id = NEW.rso_id AND (
            SELECT COUNT(*) FROM user_rsos WHERE rso_id = NEW.rso_id
          ) >= 5;
        ELSIF (TG_OP = 'DELETE') THEN
          UPDATE rsos
          SET is_active = FALSE
          WHERE rso_id = OLD.rso_id AND (
            SELECT COUNT(*) FROM user_rsos WHERE rso_id = OLD.rso_id
          ) < 5;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      -- Create Triggers for RSO Status
		DO $$
		BEGIN
		IF NOT EXISTS (
			SELECT 1
			FROM pg_trigger
			WHERE tgname = 'after_user_rso_insert'
		) THEN
			CREATE TRIGGER after_user_rso_insert
			AFTER INSERT ON user_rsos
			FOR EACH ROW
			EXECUTE FUNCTION update_rso_status();
		END IF;
		END
		$$;

		DO $$
		BEGIN
		IF NOT EXISTS (
			SELECT 1
			FROM pg_trigger
			WHERE tgname = 'after_user_rso_delete'
		) THEN
			CREATE TRIGGER after_user_rso_delete
			AFTER DELETE ON user_rsos
			FOR EACH ROW
			EXECUTE FUNCTION update_rso_status();
		END IF;
		END
		$$;

    `);

		console.log("Database tables and triggers created successfully!");
	} catch (err) {
		console.error("Error setting up the database:", err);
	}
};

setupDatabase();
