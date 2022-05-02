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
tripId int NOT NULL,
    userId int NOT NULL,
    boatType varchar(255),
    seats int(255) NOT NULL,
    price varchar(255),
    routes varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    primary key (tripId),
    foreign key (userId) REFERENCES usersInfo(userId)
);
----------------------------------------------------------------
SELECT usersInfo.userId, usersInfo.fname, Trips.boatType, Trips.seats, Trips.prices, Trips.routes
FROM usersInfo
INNER JOIN trips ON usersInfo.userId=Trips.userId;

--create table contact to store contact information
CREATE TABLE contact (
    contactId SERIAL,
    TIMESTAMP,
    f_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE Msg (
    msgId int NOT NULL,
    userId int NOT NULL,
    msgContent VARCHAR(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    primary key (msgId),
    foreign key (userId) REFERENCES usersInfo(userId)
);