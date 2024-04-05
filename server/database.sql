CREATE DATABASE campusconnect;

CREATE TABLE Users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('student', 'admin', 'superAdmin')),
  university_id INT,
  FOREIGN KEY (university_id) REFERENCES Universities(university_id)
);

CREATE TABLE Universities (
  university_id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  location TEXT,
  description TEXT,
  number_of_students INT,
  pictures TEXT[] -- Array of image URLs
  email_domain VARCHAR(255) UNIQUE;
);

CREATE TABLE RSOs (
  rso_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  admin_id INT,
  university_id INT,
  FOREIGN KEY (admin_id) REFERENCES Users(user_id),
  FOREIGN KEY (university_id) REFERENCES Universities(university_id)
);

CREATE TABLE Events (
  event_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(50),
  description TEXT,
  event_time TIME,
  event_date DATE,
  location_name VARCHAR(255),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  visibility VARCHAR(50) CHECK (visibility IN ('public', 'private', 'rso')),
  created_by INT,
  university_id INT,
  rso_id INT,
  FOREIGN KEY (created_by) REFERENCES Users(user_id),
  FOREIGN KEY (university_id) REFERENCES Universities(university_id),
  FOREIGN KEY (rso_id) REFERENCES RSOs(rso_id)
);

CREATE TABLE CommentsRatings (
  comment_id SERIAL PRIMARY KEY,
  user_id INT,
  event_id INT,
  text TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

CREATE TABLE User_RSOs (
  user_id INT,
  rso_id INT,
  PRIMARY KEY (user_id, rso_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (rso_id) REFERENCES RSOs(rso_id) ON DELETE CASCADE
);