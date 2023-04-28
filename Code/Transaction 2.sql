START TRANSACTION;

-- average latitude and longitude of all locations in the system before deletion
DROP TABLE IF EXISTS avg_coordinates_before;
CREATE TABLE avg_coordinates_before AS
SELECT AVG(C.lat_degrees + C.lat_minutes / 60 + C.lat_seconds / 3600) as avg_latitude,
       AVG((C.long_degrees + C.long_minutes / 60 + C.long_seconds / 3600)*-1) as avg_longitude
FROM Locations L
JOIN Coordinate C ON L.id = C.id;

-- most common path_type_desc in the path table before deletion
DROP TABLE IF EXISTS most_common_path_type_before;
CREATE TABLE most_common_path_type_before AS
SELECT path_type_desc
FROM (
    SELECT path_type_desc, COUNT(*) as path_count
    FROM Path
    GROUP BY path_type_desc
) sub
ORDER BY path_count DESC
LIMIT 3;

DROP TABLE IF EXISTS t1;
CREATE TABLE t1 (
	SELECT DISTINCT id FROM Locations loc
  WHERE id NOT IN ( SELECT DISTINCT id FROM Locations WHERE unique_system_identifier != @USI )
	AND loc.unique_system_identifier = @USI);

DELETE FROM License WHERE unique_system_identifier = @USI;

COMMIT;