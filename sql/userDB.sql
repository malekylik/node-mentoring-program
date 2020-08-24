CREATE DATABASE nodementoring;

\c nodementoring

CREATE TABLE Users(
    id INT NOT NULL,
    login VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    age INT,
    PRIMARY KEY (id)
);

INSERT INTO Users (id, login, password, age) VALUES (1, 'log2', 'pass2', 12);
INSERT INTO Users (id, login, password, age) VALUES (2, 'some-example-user-2', '5p4a3s2s', 55);
INSERT INTO Users (id, login, password, age) VALUES (3, 'js', 'node', 13);
