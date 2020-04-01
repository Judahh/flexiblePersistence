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

CREATE TABLE
IF NOT EXISTS object2
(
    _id SERIAL UNIQUE,
    test VARCHAR
(100),
    test2 VARCHAR
(100),
    testNumber INTEGER,
    CONSTRAINT object2_PK
    PRIMARY KEY
(_id)
);

CREATE TABLE
IF NOT EXISTS object3
(
    _id SERIAL UNIQUE,
    test VARCHAR
(100),
    testNumber INTEGER,
    CONSTRAINT object3_PK
    PRIMARY KEY
(_id)
);