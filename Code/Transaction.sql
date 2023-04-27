DELIMITER //

START TRANSACTION;
SET @USI = 111;
DROP TABLE IF EXISTS t1, t2, t3;
CREATE TABLE t1 (
	SELECT DISTINCT id FROM Locations WHERE unique_system_identifier = @USI);
CREATE TABLE t2 (
	SELECT DISTINCT id FROM Locations loc
  WHERE id IN ( SELECT id FROM t1 ) AND loc.unique_system_identifier != @USI);
CREATE TABLE t3 (
	SELECT id FROM t1
    WHERE id NOT IN	(SELECT id FROM t2)  );
-- DELETE FROM t1 WHERE id IN ( SELECT id FROM t2 ) AND id <> -100;

DROP TRIGGER IF EXISTS DeletePathsAndLocations;
CREATE TRIGGER DeletePathsAndLocations
BEFORE DELETE
ON License
FOR EACH ROW
BEGIN
  DECLARE done BOOLEAN DEFAULT FALSE;
  DECLARE curr_id INT;
  DECLARE ids CURSOR FOR
    SELECT id FROM t3;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  DELETE FROM Path WHERE unique_system_identifier = @USI;
  DELETE FROM Locations WHERE unique_system_identifier = @USI;

  OPEN ids;

  REPEAT
    DELETE FROM Coordinate WHERE id = curr_id;
    FETCH NEXT FROM ids INTO curr_id;
  UNTIL done
  END REPEAT;

  CLOSE ids;

END;

DELETE FROM License WHERE unique_system_identifier = @USI;
COMMIT;

//

DELIMITER ;