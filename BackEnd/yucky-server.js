const serveStatic = require('serveStatic');
const path = require('path');
const express = require("express");
const app = express();

//home
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/home.html"));
});
app.use('/', serverStatic(path.join(__dirname, 'Public')));

//contact
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/contact.html"));
  });
app.use('/contact', serverStatic(path.join(__dirname, 'Public')));

//registration
app.get("/registrationForm", function(req, res) {
  res.sendFile(path.join(__dirname, "/registrationForm.html"));
});
app.use('/registrationForm', serverStatic(path.join(__dirname, 'Public')));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
