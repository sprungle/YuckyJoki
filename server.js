const serveStatic = require('serve-static')
const path = require('path');
const express = require("express");
const bodyParser= require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

// connect to the database
app.get('/db', async (req, res) => {
    const { Pool } = require('pg');
    const pool = (() => {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    })();
try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM usersInfo;');
    const results = { 'results': (result) ? result.rows : null};
    res.json( results );
    client.release();
} catch (err) {
      console.error(err);
      res.json({ error: err });
      }
  });
// GET home page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "UI/home.html"));
});
app.use('/', serveStatic(path.join(__dirname, 'UI')));
//__________________________________________________
// POST data from the registration to database
app.post('/submit', async (req, res) => {
    const { Pool } = require('pg');
    const pool = (() => {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    })();
  try {
      const {fName, email, phoneNumber,password} = req.body;
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const client = await pool.connect();
      client.query('INSERT INTO usersInfo VALUES (DEFAULT,$1, $2, $3,$4)',[fName, email, phoneNumber,hashedPassword]);
  //const results = { 'results': (result) ? result.rows : null};
  //res.json( results );
      res.redirect('/')
      client.release();
  } catch (err) {
        console.error(err);
        res.json({ error: err });
    }
  });

//__________________________________________________
// validate login data
  
app.post('/login', async (req, res) => {
    const { Pool } = require('pg');
    const pool = (() => {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        }); 
    })();
  // find out the user exist or not
  const {Email, Password} = req.body;
  const client = await pool.connect();
  const user = await client.query('SELECT email, password FROM usersInfo WHERE email=$1;',[Email])
  const loginUser = (user) ? user.rows : null;
 
 //------------this following 3 line3 of code does not work as expected-------------------
  if (loginUser==null) {
      return res.status(400).send('Incorrect username or password')
  }
  // compare the password
  try {

      if(await bcrypt.compare(req.body.Password, loginUser[0].password)) {
          client.query('INSERT INTO  loginInfo VALUES ($1);',[Email])
          res.send('Logged in successfully');
      } else {
          res.send('Incorrect username or password')
        }
      client.release();
  } catch (err) {
      console.error(err);
      res.json({ error: err });
      }
    });

//__________________________________________________
// GET book or offer page  
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'solution/src/index.html' ));
  });
app.use('/index', serveStatic(path.join(__dirname, 'solution/src')));
//_________________________________________________
// POST book ofer page user iput into database

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
//_________________________________________________
// POST contact page data into database

app.post('/contact', async (req, res) => {
  const { Pool } = require('pg');
  const pool = (() => {
      return new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false
          }
      });
  })();
try {
    const {f_name, contact_email,message} = req.body;
    const client = await pool.connect();
    client.query('INSERT INTO contact VALUES (DEFAULT,now(),$1, $2, $3)',[f_name, contact_email, message]);
    //const results = { 'results': (result) ? result.rows : null};
    //res.json( results );
    res.redirect('/contact.html')
    client.release();
} catch (err) {
      console.error(err);
      res.json({ error: err });
  }
});
//__________________________________________________
//UPDATE account page, update user information
app.put('/account', async (req, res) => {
    const { Pool } = require('pg');
    const pool = (() => {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
         });
    })();
    try {
  
        const  {new_name, new_email, new_phone} = req.body;
        const client = await pool.connect();
        const userAccount = await client.query('SELECT * FROM loginInfo;')
        const emailAccount = (userAccount) ? userAccount.rows : null;
        const oldEmail=emailAccount[0].email;
        client.query('UPDATE usersInfo SET fName=$1, email=$2, phoneNumber=$3 WHERE email=$4',[new_name, new_email, new_phone,oldEmail]);
        res.redirect('/')
        client.release();
    } catch (err) {
        console.error(err);
        res.json({ error: err });
      }
  });
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});