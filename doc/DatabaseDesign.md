# database design: data definition language

```sql
USE `primaryset`;

DROP TABLE IF EXISTS `Licensee`;

CREATE TABLE Licensee(
	licensee_id VARCHAR(9) NOT NULL,
	name VARCHAR(200),
	email VARCHAR(50),
	street_address VARCHAR(60),
	city VARCHAR(20),
	state VARCHAR(2),
	PRIMARY KEY(licensee_id)
);
INSERT INTO Licensee (licensee_id,name,email,street_address,city,state) VALUES ('L01543253','NBC TELEMUNDO LICENSE LLC','angela.ball@nbcuni.com','300 New Jersey Ave. SUITE 7','WASHINGTON','DC'); -- ...

DROP TABLE IF EXISTS `Path`;

CREATE TABLE Path(
	unique_system_identifier VARCHAR(10),
	path_number INT,
	transmit_location_number INT,
	receiver_location_number INT,
	transmit_antenna_number INT,
	receiver_antenna_number INT,
	path_type_desc VARCHAR(50),
	licensee_id VARCHAR(9),
	PRIMARY KEY(unique_system_identifier,path_number)
);
INSERT INTO Path (unique_system_identifier,path_number,transmit_location_number,receiver_location_number,transmit_antenna_number,receiver_antenna_number,path_type_desc,licensee_id) VALUES (954599,1,1,1,1,2,'Area','L00293903'); -- ...

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

INSERT INTO Coordinates (id,lat_degrees,lat_minutes,lat_seconds,lat_direction,long_degrees,long_minutes,long_seconds,long_direction) VALUES (1,40,44,54,'N',73,59,9,'W'); -- ...

DROP TABLE IF EXISTS `Locations`;

CREATE TABLE Locations(
	unique_system_identifier VARCHAR(10),
	location_number INT NOT NULL,
	location_address VARCHAR(100),
	location_city VARCHAR(100),
	location_county VARCHAR(100),
	location_state VARCHAR(100),
	id INT NOT NULL,
	PRIMARY KEY (unique_system_identifier, location_number),
	FOREIGN KEY (id) REFERENCES Coordinates(id)
);

INSERT INTO Locations (unique_system_identifier,location_number,location_address,location_city,location_county,location_state,id) VALUES (954597,1,'VIC: NEW YORK NY','NEW YORK','NEW YORK','NY',1); -- ...

```