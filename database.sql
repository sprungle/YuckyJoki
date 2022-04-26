



-- creat table to store registration form data

CREATE TABLE usersInfo (
    userId SERIAL,
    fname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber INTEGER NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (userId),
    UNIQUE(email)
);

-- create table to store login username:email
CREATE TABLE loginInfo (
    Email VARCHAR(255) NOT NULL,
    PRIMARY KEY (Email)
);

--create table to store orders information