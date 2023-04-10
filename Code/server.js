var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
// var connection = mysql.createConnection({
//                 host: '34.134.82.72',
//                 user: 'root',
//                 password: 'LowerDecksFTW',
//                 database: 'primaryset'
// });

// connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', {title: 'HFTracer'});
});

app.get('/success', function(req, res) {
      res.send({'message': 'Attendance marked successfully!'});
});
 
// TODO: Write this part of the code
// PLEASE DON'T REMOVE ANY COMMENTED CODE
// ******************************************************************************************
app.post('/insert', function(req, res) {
  var usi = req.body.usi;
  var name = req.body.name;
  var email = req.body.email;
  var street = req.body.street;
  var city = req.body.city;
  var state = req.body.state;
  //INSERT INTO License (unique_system_identifier,name,email,street_address,city,state) VALUES ('954597','NBC TELEMUNDO LICENSE LLC','angela.ball@nbcuni.com','300 New Jersey Ave. SUITE 7','WASHINGTON','DC');
  var sql = `INSERT INTO License (unique_system_identifier,name,email,street_address,city,state) VALUES (${usi},'${name}','${email}','${street}','${city}','${state}')`;

  console.log(sql);
  res.send({'message': 'Record Inserted Successfully'});
  // connection.query(sql, function(err, result) {
  //   if (err) {
  //     res.send(err)
  //     return;
  //   }
  //   res.redirect('/success');
  // });
});

app.post('/search', function(req, res) {
  var usi = req.body.usi;
  var name = req.body.name;
  
  var sql = `SELECT li.unique_system_identifier, li.name, li.email, li.street_address, li.city, li.state
  FROM License li
  WHERE li.unique_system_identifier = ${usi} AND li.name = '${name}';`
  console.log(sql);
  res.redirect('/success');

});

app.post('/update', function(req, res) {
  var usi = req.body.usi;
  var name = req.body.name;
  var email = req.body.email;
  var street = req.body.street;
  var city = req.body.city;
  var state = req.body.state;
  //INSERT INTO Licensee (unique_system_identifier,name,email,street_address,city,state) VALUES ('954597','NBC TELEMUNDO LICENSE LLC','angela.ball@nbcuni.com','300 New Jersey Ave. SUITE 7','WASHINGTON','DC');
  var sql = `UPDATE License
  SET name = '${name}', email= '${email}', street_address= '${street}', city= '${city}', state= '${state}'
  WHERE unique_system_identifier = ${usi};`;

  console.log(sql);
  res.send({'message': 'Record updated Successfully'});

});

app.post('/delete', function(req, res) {
  var usi = req.body.usi;
  var name = req.body.name;
  
  var sql = `DELETE FROM License li
  WHERE li.unique_system_identifier = ${usi} AND li.name = '${name}';`
  console.log(sql);
  res.send({'message': 'Record deleted Successfully'});

});

app.post('/optimise', function(req, res) {
  // Stage 4 Point 5 Optimisations, I have no idea what to do here @justin can suggest
  var usi = req.body.usi;
  
  var sql = `INSERT INTO attendance (netid, present) VALUES ('${usi}',1)`;

});
  // ******************************************************************************************


app.listen(80, function () {
    console.log('Node app is running on port 80');
});
