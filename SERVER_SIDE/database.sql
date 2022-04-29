-- create table usersInfo
CREATE TABLE usersInfo (
    userId SERIAL,
    fname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber INTEGER NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (userId),
    UNIQUE(email)
);
-- create login table
CREATE TABLE loginInfo (
    Email VARCHAR(255) NOT NULL,
    PRIMARY KEY (Email)
);

--create table Trips
CREATE TABLE Trips(
    TripId int NOT NULL,
    userId int NOT NULL,
    BoatType varchar(255),
    seats int NOT NULL,
    prices varchar(255),
	Routes varchar(255) NOT NULL,
	primary key(TripId),
	foreign key(userId) REFERENCES usersInfo(userId)
);
----------------------------------------------------------------
SELECT usersInfo.userId, usersInfo.fName, Trips.BoatType, 
FROM usersInfo
INNER JOIN Trips ON usersInfo.userId = Trips.userId;

--create table contact to store contact information
CREATE TABLE contact (
    contactId SERIAL,
    TIMESTAMP,
    f_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    PRIMARY KEY (userId)
);