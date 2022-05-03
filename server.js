const serveStatic = require('serve-static')
const path = require('path');
const express = require("express");
const bodyParser= require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const { Pool } = require('pg');
//const cookieParser = require('cookie-parser');
//app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

// connect to the database
app.get('SERVER_SIDE/database.sql', async (req, res) => {

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

var homePath = path.join(__dirname, "UI/home.html");

// GET home page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "UI/home.html"));
});
app.use('/', serveStatic(path.join(__dirname, 'UI')));

app.get('/js-api-loader', function(req, res) {
    res.sendFile(path.join(__dirname, 'node_modules/@googlemaps/js-api-loader/dist/index.min.js'));
});

app.get('/markerclustererplus', function(req, res) {
    res.sendFile(path.join(__dirname, 'node_modules/@googlemaps/markerclustererplus/dist/index.min.js'));
});

app.get('/captains', async (req, res) =>  {
    try{
        const pool = (() => {
            return new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false }
            });
        })();
        const client = await pool.connect();
        client.query('SELECT * FROM Trips;', (err, resp) => {
            var reply = { trips: [] };
            if (!err){
                for(let i = 0; i < resp.rows.length; i++){
                    var row = resp.rows[i];
                    reply.trips.push({ tripId: row["tripid"], 
                                       userId: row["userid"],
                                       boatType: row["boattype"],
                                       seats: row["seats"],
                                       price: row["prices"] != null ? row["prices"] : "",
                                       routes: row["routes"] });                
                }
            } 
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(reply));
        });
        client.release();
    } catch(err){
        console.error(err);
        res.json({ error: err });
    }
});
//__________________________________________________
// POST data from the registration to database
app.post('/submit', async (req, res) => {
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
          client.query('INSERT INTO loginInfo VALUES ($1);',[Email])
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
// GET book or offer page  /solution/src/request-trip

var bookPagePath = path.join(__dirname, 'solution/src/index.html' );

app.get('/', (req, res) => {
    res.sendFile(bookPagePath);
  });
app.use('/', serveStatic(path.join(__dirname, 'solution/src')));

// POST book ofer page user iput into database
app.post('/offer-trip', async (req, res) => {
    const pool = (() => {
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } });
    })();
    try{
        const {userI, bType, seatsP, price, route} = req.body;
        const client = await pool.connect();
        var trows = await client.query('SELECT * FROM Trips;');
        client.query('INSERT INTO Trips VALUES ($1, $2, $3, $4, $5, $6)', [trows.rows.length, userI, bType, seatsP, price, route]);
        res.redirect(bookPagePath, 200);
        client.release();
    } 
    catch (err) {
        console.error(err);
        res.json({ error: err });
    }
});

app.post('/request-trip', async (req, res) => {    
    const pool = (() => {
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } }); })();

    try {
        const {userI, bType, seatsP, price, route} = req.body;
        const client = await pool.connect();
        var trows = await client.query('SELECT * FROM Trips;');
        client.query('INSERT INTO Trips VALUES ($1, $2, $3, $4, $5, $6)', [trows.rows.length, userI, bType, seatsP, price, route]);
        res.redirect(bookPagePath, 200);
        client.release();
    } 
    catch (err) {
        console.error(err);
        res.json({ error: err });
    }
});

app.post('/send-msg', async (req, res) => {
    const pool = (() => {
    return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
    });
})();
  try{
      const {m} = req.body;
      client.query('INSERT INTO Msg VALUES ($1)',[m]);
      res.redirect(bookPagePath, 200);
      client.release();
    }
    catch (err) {
        console.error(err);
        res.json({ error: err });
    }
});
//_________________________________________________
// POST contact page data into database

app.post('/contact', async (req, res) => {
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