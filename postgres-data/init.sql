DROP TABLE IF EXISTS sample_user;

CREATE TABLE sample_user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO sample_user (name) VALUES ('Alice'),('Bob'),('Cha');
