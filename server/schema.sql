DROP DATABASE chatterbox;
CREATE DATABASE chatterbox;

USE chatterbox;


CREATE TABLE rooms (
  roomID INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY  (roomID)
);

CREATE TABLE users (
  userID INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(30),
  PRIMARY KEY  (userID)
);

CREATE TABLE messages (
  ID INT NOT NULL AUTO_INCREMENT,
  username INT,
  text VARCHAR(140),
  roomname INT,
  PRIMARY KEY  (ID),
  FOREIGN KEY (username) REFERENCES users(userID),
  FOREIGN KEY (roomname) REFERENCES rooms(roomID)
);

/* Create other tables and define schemas for them here! *

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

