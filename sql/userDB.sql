CREATE DATABASE nodementoring;

\c nodementoring

CREATE TABLE Users(
    id SERIAL,
    login VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    age INT,
    PRIMARY KEY (id)
);

CREATE TABLE Groups(
    id SERIAL,
    name VARCHAR (255) NOT NULL,
    permissions VARCHAR (255) []
);

INSERT INTO Users (login, password, age) VALUES ('log2', 'pass2', 12);
INSERT INTO Users (login, password, age) VALUES ('some-example-user-2', '5p4a3s2s', 55);
INSERT INTO Users (login, password, age) VALUES ('js', 'node', 13);
