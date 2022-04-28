/* GET home page. */
app.get('/index.html', function(req, res, next) {
    res.render('offer-trip', { title: 'Offer-Trip' });
  });
   
  app.post('/offer-trip', function(req, res, next) {
    var bname = req.body.bname;
    var seatsC = req.body.seatsC;
    var currencyField = req.body.currencyField;
   
    var sql = `INSERT INTO Trips (boatType, seats, price, created_at) VALUES ("${bname}", "${seatsC}", "${currencyField}", NOW())`;
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      req.flash('success', 'Data added successfully!');
      res.redirect('/index.html');
    });
});

    app.get('/index.html', function(req, res, next) {
        res.render('request-trip', { title: 'request-trip' });
      });
  app.post('/request-trip', function(req, res, next) {
    var seatsP = req.body.seatsP;
       
    var sql = `INSERT INTO Trips (seats, created_at) VALUES ("${seatsP}", NOW())`;
    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log('record inserted');
        req.flash('success', 'Data added successfully!');
        res.redirect('/index.html');
  });
});
app.get('/index.html', function(req, res, next) {
    res.render('sendMsg', { title: 'sendMsg' });
  });
app.post('/sendMsg', function(req, res, next) {
var msg = req.body.m;
   
var sql = `INSERT INTO Msg (msgContent, created_at) VALUES ("${msg}", NOW())`;
db.query(sql, function(err, result) {
    if (err) throw err;
    console.log('record inserted');
    req.flash('success', 'Data added successfully!');
    res.redirect('/index.html');
});
});