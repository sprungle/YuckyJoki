//IMPORTANT: If this is edited, make sure all referrals to other files have correct path!

const serveStatic = require('serve-static')
const path = require('path');
const express = require("express");
const app = express();

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/backend/back.home.html"));
});
app.use('/', serveStatic(path.join(__dirname, 'backend/public')));

app.get("/home", function(req, res) {
  res.sendFile(path.join(__dirname, "/backend/back.home.html"));
});
app.use('/home', serveStatic(path.join(__dirname, 'backend/public')));

app.get("/about", function(req, res) {
  res.sendFile(path.join(__dirname, "/backend/back.about.html"));
});
app.use('/about', serveStatic(path.join(__dirname, 'backend/public')));

app.get("/contact", function(req, res) {
    res.sendFile(path.join(__dirname, "/backend/back.contact.html"));
  });
app.use('/contact', serveStatic(path.join(__dirname, 'backend/public')));

app.get("/registrationForm", function(req, res) {
  res.sendFile(path.join(__dirname, "/backend/back.registrationForm.html"));
});
app.use('/registrationForm', serveStatic(path.join(__dirname, 'backend/public')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
