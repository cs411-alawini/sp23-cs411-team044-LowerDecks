USE `primaryset`;

SELECT * FROM License LIMIT 10;

SELECT * FROM License WHERE unique_system_identifier = 111;
SELECT * FROM Path WHERE unique_system_identifier = 111;
SELECT * FROM Coordinate WHERE id = 999999;
SELECT * FROM Coordinate WHERE id IN (SELECT id FROM Locations WHERE unique_system_identifier = 111);
SELECT * FROM Locations WHERE unique_system_identifier = 111;
SELECT id FROM Locations WHERE unique_system_identifier = 111;
SELECT id FROM t1;
-- SELECT id FROM Locations WHERE unique_system_identifier = 111;
-- SELECT * FROM Coordinate LIMIT 5;
SELECT * FROM License WHERE unique_system_identifier = 222;

DELETE FROM Coordinate WHERE id = 999999;
DELETE FROM License WHERE unique_system_identifier = 222;
DELETE FROM Locations WHERE unique_system_identifier = 222;

-- Insertion

-- Insert data into License tableLocations_ibfk_1
INSERT INTO License (unique_system_identifier, name, email, street_address, city, state)
VALUES (111, 'John Doe', 'johndoe@example.com', '123 Main St', 'Anytown', 'CA');
-- Insert data into Path table
INSERT INTO Path (unique_system_identifier, path_number, transmit_location_number, receiver_location_number, transmit_antenna_number, receiver_antenna_number, path_type_desc)
VALUES (111, 1, 1, 2, 1, 2, 'LOS');
-- Insert data into Coordinates table
INSERT INTO Coordinate (id, lat_degrees, lat_minutes, lat_seconds, lat_direction, long_degrees, long_minutes, long_seconds, long_direction)
VALUES (999999, 37.7749, 122.4194, NULL, 'N', 122.4194, 37.7749, NULL, 'W');
-- Insert data into Locations table
INSERT INTO Locations (unique_system_identifier, location_number, location_address, location_city, location_county, location_state, id)
VALUES (111, 1, '123 Main St', 'Anytown', 'Any County', 'CA', 999999);



INSERT INTO License (unique_system_identifier, name, email, street_address, city, state)
VALUES (222, 'John Doe 2', 'johndoe@example.com', '123 Main St', 'Anytown', 'CA');
INSERT INTO Locations (unique_system_identifier, location_number, location_address, location_city, location_county, location_state, id)
VALUES (222, 1, '321 Main St', 'Anytown', 'Any County', 'CA', 999999);
