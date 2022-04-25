//IMPORTANT: If this is edited, make sure all referrals to other files have correct path!


const serveStatic= require('serve-static');
const path=require('path');
const bodyParser= require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');


const app = express();



app.use(express.json());

// connect database and get the data from it 
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

//home page
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
  });
app.use('/', serveStatic(path.join(__dirname, 'public')));

// get the registrationForm
app.get('/registrationForm', (req, res) => {
  res.sendFile(path.join(__dirname, 'registrationForm.html'));
});
app.use('/registrationForm', serveStatic(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
// post data from the registration to database
app.post('/registrationForm', async (req, res) => {
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
  client.release();
  } catch (err) {
  console.error(err);
  res.json({ error: err });
}
});
// get login form
app.get('/login', async (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
  });
  app.use(bodyParser.urlencoded({extended: false}));
  // post data from the registration to database
  
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
    const {Email, Password} = req.body;
    const client = await pool.connect();
    const user = await client.query('SELECT email, password FROM usersInfo WHERE email=$1;',[Email])
    const loginUser = (user) ? user.rows : null;
   
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    
    try {
  
      if(await bcrypt.compare(req.body.Password, loginUser[0].password)) {
        res.send('Logged in successfully');
      } else {
        res.send('Not Allowed')
      }
    
    
    
    
    //res.json( results );
  
    client.release();
    } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
  });



// contact page
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
  });
app.use('/contact', serveStatic(path.join(__dirname, 'public')));








// loscal server
const PORT =process.env.PORT ||3010;
app.listen(PORT,()=> {
  console.log(`listening on ${PORT}......`)
  });