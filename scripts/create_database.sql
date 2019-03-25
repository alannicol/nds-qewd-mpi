DROP SCHEMA IF EXISTS mpi CASCADE;
CREATE SCHEMA mpi
    AUTHORIZATION postgres;

CREATE TABLE mpi."Gender" (
    id SERIAL PRIMARY KEY,
    description VARCHAR(25)
);

ALTER TABLE mpi."Gender" 
    OWNER to postgres;

CREATE TABLE mpi."Patient" (
    id SERIAL PRIMARY KEY,
    prefix VARCHAR(10),
    family VARCHAR(25),
    gender INTEGER REFERENCES mpi."Gender"(id),
    deceased BOOLEAN,
    birthDate DATE
);

ALTER TABLE mpi."Patient" 
    OWNER to postgres;

CREATE TABLE mpi."Identifier" (
    id SERIAL PRIMARY KEY,
    value VARCHAR(90),
    patientId INTEGER REFERENCES mpi."Patient"(id)
);

ALTER TABLE mpi."Identifier" 
    OWNER to postgres;

CREATE TABLE mpi."Given_Name" (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50),
    patientId INTEGER REFERENCES mpi."Patient"(id)
);

ALTER TABLE mpi."Given_Name" 
    OWNER to postgres;

CREATE TABLE mpi."Address" (
    id SERIAL PRIMARY KEY,
    line1 VARCHAR(50),
    line2 VARCHAR(50),
    city VARCHAR(25),
    district VARCHAR(25),
    postalCode VARCHAR(25),
    country VARCHAR(25),
    patientId INTEGER REFERENCES mpi."Patient"(id)
);

ALTER TABLE mpi."Address" 
    OWNER to postgres;

CREATE TABLE mpi."Telecom" (
    id SERIAL PRIMARY KEY,
    value VARCHAR(25),
    used VARCHAR(25),
    patientId INTEGER REFERENCES mpi."Patient"(id)
);

ALTER TABLE mpi."Address" 
    OWNER to postgres;

INSERT INTO mpi."Gender" (description)
VALUES
('male'),('female'),('other'),('unknown');