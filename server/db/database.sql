CREATE DATABASE monkeyw_images_crud;

CREATE TABLE image(
    id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(200),
    name VARCHAR(200),
    data LONGBLOB,
    PRIMARY KEY(ID)
);