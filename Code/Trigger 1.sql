
-- Trigger1
DELIMITER //

CREATE TRIGGER delete_license_data_trigger
AFTER DELETE
ON License
FOR EACH ROW
BEGIN
  DECLARE deleted_location_id INT;
  DECLARE done INT DEFAULT FALSE;
  DECLARE cursor_location_ids CURSOR FOR SELECT id FROM Locations WHERE unique_system_identifier = OLD.unique_system_identifier;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  -- Delete corresponding entries from the Path table
  DELETE FROM Path WHERE unique_system_identifier = OLD.unique_system_identifier;

  -- Get the ids of the deleted Location entries
  SET @deleted_location_ids = CONCAT('SELECT id FROM Locations WHERE unique_system_identifier = ', OLD.unique_system_identifier);

  -- Loop through the ids and delete corresponding entries from the Coordinates table
  OPEN cursor_location_ids;
  location_loop: LOOP
    FETCH cursor_location_ids INTO deleted_location_id;
    IF done THEN
      LEAVE location_loop;
    END IF;
    DELETE FROM Coordinates WHERE id = deleted_location_id;
  END LOOP location_loop;
  CLOSE cursor_location_ids;

  -- Delete corresponding entries from the Locations table
  DELETE FROM Locations WHERE unique_system_identifier = OLD.unique_system_identifier;
END //

DELIMITER ;

DROP TRIGGER delete_license_data_trigger;

-- Delete entry from License table to trigger cascade delete
DELETE FROM License WHERE unique_system_identifier = 111;