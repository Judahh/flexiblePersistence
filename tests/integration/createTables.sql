CREATE TABLE
IF NOT EXISTS object
(
    _id SERIAL UNIQUE,
    test VARCHAR
(100),
    testNumber INTEGER,
    CONSTRAINT object_PK
    PRIMARY KEY
(_id)
);