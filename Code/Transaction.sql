-- DROP TRIGGER DeletePathsAndLocations;
SELECT id FROM Locations WHERE unique_system_identifier = 111;


DELIMITER //

START TRANSACTION;
SET @USI = 111;
DROP TRIGGER IF EXISTS DeletePathsAndLocations;
CREATE TRIGGER DeletePathsAndLocations
BEFORE DELETE
ON License
FOR EACH ROW
BEGIN
  DECLARE done BOOLEAN DEFAULT FALSE;
  DECLARE curr_id INT;
  DECLARE ids CURSOR FOR
    SELECT id FROM Locations WHERE unique_system_identifier = @USI;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  DELETE FROM Path WHERE unique_system_identifier = @USI;

  DELETE FROM Locations WHERE unique_system_identifier = @USI;

  OPEN ids;

  REPEAT
    FETCH NEXT FROM ids INTO curr_id;
    DELETE FROM Coordinate WHERE id = curr_id;
  UNTIL done
  END REPEAT;

  CLOSE ids;

END;

DELETE FROM License WHERE unique_system_identifier = @USI;
COMMIT;

//

DELIMITER ;