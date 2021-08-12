CREATE DATABASE mrcoffee

DROP TABLE IF EXISTS users
DROP TABLE IF EXISTS schedules

CREATE TABLE users (
	id INT GENERATED ALWAYS AS IDENTITY,
	first_name CHARACTER VARYING (50) NOT NULL,
	last_name CHARACTER VARYING (50) NOT NULL,
	email CHARACTER VARYING (250) NOT NULL UNIQUE,
	password CHARACTER VARYING (50) NOT NULL,
	PRIMARY KEY(id)
)

CREATE TABLE schedules (
	id INT GENERATED ALWAYS AS IDENTITY,
	user_id INT,
	day INTEGER NOT NULL,
	CHECK (day BETWEEN 1 AND 7),
	start_at TIME NOT NULL,
	end_at TIME NOT NULL,

	PRIMARY KEY(id),
	CONSTRAINT fk_user
		FOREIGN KEY(user_id)
		REFERENCES users(id)
)

INSERT INTO users (
	first_name,
	last_name,
	email,
	password)
VALUES('Jan', 'Leśniewski', 'janlesniewski@gmail.com', 'alamakota123');
INSERT INTO users (
	first_name,
	last_name,
	email,
	password)
VALUES('Iza', 'Sosnowska', 'iza.sosna@gmail.com', 'kotmaale321');
INSERT INTO schedules (
	user_id,
	day,
	start_at,
	end_at)
VALUES('1', '2', '08:00', '10:00');