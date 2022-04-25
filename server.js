//IMPORTANT: If this is edited, make sure all referrals to other files have correct path!
const serveStatic= require('serve-static');
const path=require('path');
const bodyParser= require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

// connect database and get all the data from usersInfo table.
app.get('/db', async (req, res) => {
// connet to database
const { Pool } = require('pg');
const pool = (() => {
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
  })();
// get data from userInfo table
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

// get home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
    });
app.use('/', serveStatic(path.join(__dirname, 'public')));

// get the registrationForm
app.get('/registrationForm', (req, res) => {
    res.sendFile(path.join(__dirname, 'registrationForm.html'));
    });
app.use('/registrationForm', serveStatic(path.join(__dirname, 'public')));

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
            res.redirect('/')
        }catch (err) {
            console.error(err);
            res.json({ error: err });
          }
    });
// get login form
app.get('/login',  (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
    });

// post data from login to database login table 
  
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
  // check if the email exists
    const {Email, Password} = req.body;
    const client = await pool.connect();
    const user = await client.query('SELECT email, password FROM usersInfo WHERE email=$1;',[Email])
    const loginUser = (user) ? user.rows : null;
   
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
  // validate the password 
    try {
        if(await bcrypt.compare(req.body.Password, loginUser[0].password)) {
            res.send('Logged in successfully');
            res.redirect('/')
        } else {
            res.send('Not Allowed')
            res.redirect('/login')
    }
        //res.json( results );
          client.release();
        } catch (err) {
            console.error(err);
            res.json({ error: err });
          }
      });

//get acount page
app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, 'account.html'));
  });
app.use('/account', serveStatic(path.join(__dirname, 'public')));
//update account data is changing userInfo
app.put('/account', async (req, res) => {
  // connet to database
  const { Pool } = require('pg');
  const pool = (() => {
      return new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false
          }
      });
    })();
  // get data from userInfo table
      try {
          const client = await pool.connect();
          const userName = await client.query('SELECT * FROM loginInfo;');
          const user_name = { 'userName': (userName) ? userName.rows : null};
          const oldEmail=user_name[0].Email;
          const userId=await client.query('SELECT userId FROM usersInfo WHERE email=$1;',[oldEmail]);
          const user_id={ 'userId': (userId) ? userId.rows : null};
          const userId2=user_id[0].userId;
          client.query('UPDATE fName, email, phoneNumber WHERE userId=$1;',[userId2]);
              res.send ('Your information has been updated.')
              res.redirect('/account')
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