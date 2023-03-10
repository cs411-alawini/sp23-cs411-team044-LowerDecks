# database design: data definition language

```sql
USE `primaryset`;

DROP TABLE IF EXISTS `Licensee`;

CREATE TABLE License(
	unique_system_identifier VARCHAR(10) NOT NULL,
	name VARCHAR(200),
	email VARCHAR(50),
	street_address VARCHAR(60),
	city VARCHAR(20),
	state VARCHAR(2),
	PRIMARY KEY(unique_system_identifier)
);

DROP TABLE IF EXISTS `Path`;

CREATE TABLE Path(
	unique_system_identifier VARCHAR(10) NOT NULL,
	path_number INT NOT NULL,
	transmit_location_number INT,
	receiver_location_number INT,
	transmit_antenna_number INT,
	receiver_antenna_number INT,
	path_type_desc VARCHAR(50),
	PRIMARY KEY(unique_system_identifier, path_number)
    FOREIGN KEY (unique_system_identifier) REFERENCES License(unique_system_identifier)
);

DROP TABLE IF EXISTS `Coordinates`;

CREATE TABLE Coordinates(
	id INT NOT NULL,
	lat_degrees DOUBLE,
	lat_minutes DOUBLE,
	lat_seconds DOUBLE,
	lat_direction VARCHAR(10),
	long_degrees DOUBLE,
	long_minutes DOUBLE,
	long_seconds DOUBLE,
	long_direction VARCHAR(10),
	PRIMARY KEY(id)
);

DROP TABLE IF EXISTS `Locations`;

CREATE TABLE Locations(
	unique_system_identifier INT NOT NULL,
	location_number INT NOT NULL,
	location_address VARCHAR(100),
	location_city VARCHAR(100),
	location_county VARCHAR(100),
	location_state VARCHAR(100),
	id INT NOT NULL,
	PRIMARY KEY (unique_system_identifier, location_number),
	FOREIGN KEY (id) REFERENCES Coordinates(id),
    FOREIGN KEY (unique_system_identifier) REFERENCES License(unique_system_identifier)
);


```