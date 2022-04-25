-- heroku database credentials
--Connection info string:
   --"dbname=d51jr8lvmkfu1g
   -- host=ec2-54-80-123-146.compute-1.amazonaws.com 
   --port=5432 user=eiarazeutrjcin 
   --password=924f432d4bd73a06a569f6ed0f0ffa470b148bab2cf7ef28a414a93d7bca42ac 
   --sslmode=require"
--Connection URL:
   --postgres://eiarazeutrjcin:924f432d4bd73a06a569f6ed0f0ffa470b148bab2cf7ef28a414a93d7bca42ac@ec2-54-80-123-146.compute-1.amazonaws.com:5432/d51jr8lvmkfu1g



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