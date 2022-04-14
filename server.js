
const serveStatic = require('serve-static')
const path = require('path');
const express = require("express");
const app = express();

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/home.html"));
});
app.use('/', serveStatic(path.join(__dirname, 'public')));

app.get("/about", function(req, res) {
  res.sendFile(path.join(__dirname, "/about.html"));
});
app.use('/about', serveStatic(path.join(__dirname, 'public')));

app.get("/contact", function(req, res) {
    res.sendFile(path.join(__dirname, "/contact.html"));
  });
app.use('/contact', serveStatic(path.join(__dirname, 'public')));

app.get("/registrationForm", function(req, res) {
  res.sendFile(path.join(__dirname, "/registrationForm.html"));
});
app.use('/registrationForm', serveStatic(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
