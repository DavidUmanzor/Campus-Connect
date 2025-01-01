-- UNIVERSITIES TABLE
CREATE TABLE universities (
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

-- USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('student', 'admin', 'superAdmin')),
    university_id INT REFERENCES universities(university_id) ON DELETE SET NULL
);

-- RSOS TABLE (Registered Student Organizations)
CREATE TABLE rsos (
    rso_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    admin_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    university_id INT REFERENCES universities(university_id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT FALSE
);

-- USER_RSOS TABLE (Many-to-Many relationship between users and RSOs)
CREATE TABLE user_rsos (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    rso_id INT REFERENCES rsos(rso_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, rso_id)
);

-- EVENTS TABLE
CREATE TABLE events (
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

-- COMMENTS AND RATINGS TABLE
CREATE TABLE commentsratings (
    comment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    text TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FUNCTION: Update RSO Status
CREATE OR REPLACE FUNCTION update_rso_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update RSO `is_active` status based on the number of members
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

-- TRIGGERS: Manage RSO Status
CREATE TRIGGER after_user_rso_insert
AFTER INSERT ON user_rsos
FOR EACH ROW
EXECUTE FUNCTION update_rso_status();

CREATE TRIGGER after_user_rso_delete
AFTER DELETE ON user_rsos
FOR EACH ROW
EXECUTE FUNCTION update_rso_status();
