-- Source: https://www.linode.com/docs/guides/a-primer-on-sql-transactions/#example-3-combining-commit-and-rollback-in-a-transaction

-- Example 3: Combining Commit and Rollback in a Transaction

-- The example below combines the ability to both commit and rollback transactions in the same transaction code block.

BEGIN TRANSACTION InsertCourse;

DECLARE @CrsId SMALLINT;

SELECT @CrsId = MAX(CourseId) + 1
FROM Course;

INSERT Course VALUES (@CrsId, 'Biology 101');

IF (SELECT COUNT(CourseName)
   FROM Course
   WHERE CourseName = 'Biology 101') > 1
   ROLLBACK;
END IF;

COMMIT TRANSACTION;

-- The MySQL code above inserts a row in the Course table with the next highest CourseId. Before committing the transaction, the code checks if there are more than one rows where the CourseName is Biology 101. If true, the transaction is not committed to the database. At this point, the transaction rolls back and the code segment aborts from further processing. Otherwise, if the new row is the first instance of a CourseName of Biology 101, then the transaction proceeds and is committed to the database.