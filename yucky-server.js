const path = require('path');
const express = require("express");
const app = express();

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/home.html"));
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
