SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Transaction that delete entries from License of the corresponding unique_system_identifier, which also triggers "TRIGGER" DeletePathsAndLocations, we added some other things into this Transaction in Transaction 2.sql to satisfy the "Advanced Query" requirement and implement it in the frontend.
START TRANSACTION;
DROP TABLE IF EXISTS t1;
CREATE TABLE t1 (
	SELECT DISTINCT id FROM Locations loc
  WHERE id NOT IN ( SELECT DISTINCT id FROM Locations WHERE unique_system_identifier != @USI )
	AND loc.unique_system_identifier = @USI);

DELETE FROM License WHERE unique_system_identifier = @USI;
DROP TABLE IF EXISTS t1;
COMMIT;




START TRANSACTION;
DROP TABLE IF EXISTS t1, t2, t3;
CREATE TABLE t3 (
	SELECT DISTINCT id FROM Locations WHERE unique_system_identifier = @USI);
CREATE TABLE t2 (
	SELECT DISTINCT id FROM Locations loc
  WHERE id IN ( SELECT id FROM t3 ) AND loc.unique_system_identifier != @USI);
CREATE TABLE t1 (
	SELECT id FROM t3
    WHERE id NOT IN	(SELECT id FROM t2)  );
-- DELETE FROM t1 WHERE id IN ( SELECT id FROM t2 ) AND id <> -100;

DELETE FROM License WHERE unique_system_identifier = @USI;
COMMIT;


DELETE FROM License li WHERE li.unique_system_identifier = 111 AND li.name = 'John Doe';

