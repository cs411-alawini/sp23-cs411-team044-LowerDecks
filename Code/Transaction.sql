DELIMITER //

START TRANSACTION;

DECLARE @USI INT;

SET @USI = 111;

DELETE FROM License WHERE unique_system_identifier = @USI;

CREATE TRIGGER DeletePathsAndLocations
ON License
AFTER DELETE
AS
BEGIN
  DELETE FROM Path WHERE unique_system_identifier = @USI;

  DELETE FROM Locations WHERE unique_system_identifier = @USI;

  DELETE FROM Coordinate WHERE id IN (
    SELECT id FROM Locations WHERE unique_system_identifier = @USI
  );
END;
COMMIT TRANSACTION;

//

DELIMITER ;
