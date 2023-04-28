DROP TRIGGER IF EXISTS DeletePathsAndLocations;
DROP TRIGGER IF EXISTS delete_license_and_related_items;
DROP TABLE IF EXISTS t1, t2, t3, t4;
SET @USI = 111;

DELIMITER $$

CREATE TRIGGER delete_license_and_related_items
BEFORE DELETE ON License
FOR EACH ROW
BEGIN
    DECLARE loc_number INT;

    DECLARE cur CURSOR FOR
    SELECT location_number FROM Locations
    WHERE unique_system_identifier = OLD.unique_system_identifier;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET @done = 1;

    SET @done = 0;

    
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_coordinate_ids (
        id INT
    );

   
    INSERT INTO temp_coordinate_ids (id)
    SELECT id FROM Locations
    WHERE unique_system_identifier = OLD.unique_system_identifier;
    
    DELETE FROM Path
    WHERE unique_system_identifier = OLD.unique_system_identifier;

    OPEN cur;

    FETCH cur INTO loc_number;

    WHILE @done = 0 DO
      
        DELETE FROM Locations
        WHERE location_number = loc_number;

        
        FETCH cur INTO loc_number;
    END WHILE;

   
    CLOSE cur;

    
    DELETE FROM Coordinate
    WHERE id IN (
        SELECT id FROM temp_coordinate_ids
    );

   
    DROP TEMPORARY TABLE temp_coordinate_ids;
END $$

DELIMITER ;



/*
DELIMITER //

CREATE TRIGGER DeletePathsAndLocations
BEFORE DELETE
ON License
FOR EACH ROW
BEGIN
  DECLARE done BOOLEAN DEFAULT FALSE;
  DECLARE curr_id INT;
  DECLARE ids CURSOR FOR
    SELECT id FROM t1;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  DELETE FROM Path WHERE unique_system_identifier = OLD.unique_system_identifier;
  DELETE FROM Locations WHERE unique_system_identifier = OLD.unique_system_identifier;

  OPEN ids;

  REPEAT
    FETCH NEXT FROM ids INTO curr_id;
    DELETE FROM Coordinate WHERE id = curr_id;
  UNTIL done
  END REPEAT;

  CLOSE ids;

END;
//

DELIMITER ;

*/