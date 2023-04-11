var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.134.82.72',
                user: 'root',
                password: 'LowerDecksFTW',
                database: 'primaryset'
});

connection.connect;


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

app.post('/insert', function(req, res) {
  var usi = req.body.insertusi;
  var name = req.body.insertname;
  var email = req.body.insertemail;
  var street = req.body.insertstreet;
  var city = req.body.insertcity;
  var state = req.body.insertstate;
  //INSERT INTO License (unique_system_identifier,name,email,street_address,city,state) VALUES ('954597','NBC TELEMUNDO LICENSE LLC','angela.ball@nbcuni.com','300 New Jersey Ave. SUITE 7','WASHINGTON','DC');
  var sql = `INSERT INTO License (unique_system_identifier,name,email,street_address,city,state) VALUES (${usi},'${name}','${email}','${street}','${city}','${state}')`;

  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    };
    res.send({'message': "Inserted record into License with USI "+ usi+" and name"+name,'result':result});
  });
});

app.post('/search', function(req, res) {
  var usi = req.body.searchusi;
  var name = req.body.searchname;
  
  var sql = `SELECT li.unique_system_identifier, li.name, li.email, li.street_address, li.city, li.state
  FROM License li
  WHERE li.unique_system_identifier = ${usi} AND li.name = '${name}';`
  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    console.log(result);
    res.send({'message': "Returned Records from License",'result': result});
  })
});

app.post('/update', function(req, res) {
  var usi = req.body.updateusi;
  var name = req.body.updatename;
  var email = req.body.updateemail;
  var street = req.body.updatestreet;
  var city = req.body.updatecity;
  var state = req.body.updatestate;
  //INSERT INTO Licensee (unique_system_identifier,name,email,street_address,city,state) VALUES ('954597','NBC TELEMUNDO LICENSE LLC','angela.ball@nbcuni.com','300 New Jersey Ave. SUITE 7','WASHINGTON','DC');
  var sql = `UPDATE License
  SET email= '${email}', street_address= '${street}', city= '${city}', state= '${state}'
  WHERE unique_system_identifier = ${usi} and name = '${name}';`;

  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    console.log(result);
    res.send({'message': "Record updated Successfully",'result': result});
  })
});

app.post('/delete', function(req, res) {
  var usi = req.body.deleteusi;
  var name = req.body.deletename;
  
  var sql = `DELETE FROM License li
  WHERE li.unique_system_identifier = ${usi} AND li.name = '${name}';`
  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    };
    res.send({'message': "Deleted Record from License with usi "+usi+" and name "+name, 'result':result});
  })
});

app.post('/advancedQuery1', function(req, res) {
  
  var sql = `SELECT DISTINCT License.name
  FROM License NATURAL JOIN Path JOIN Locations ON Locations.location_number = Path.transmit_location_number
  WHERE Locations.location_city = 'Chicago'
  UNION
  SELECT DISTINCT License.name
  FROM License NATURAL JOIN Path JOIN Locations ON Locations.location_number = Path.receiver_location_number
  WHERE Locations.location_city = 'New York'
  LIMIT 15;`
  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    console.log(result);
    res.send({'message': "Advanced Query 1",'result': result});
  })
});

app.post('/advancedQuery2', function(req, res) {
  
  var sql = `SELECT loc.location_city, COUNT(*) as Cnt
  FROM License li JOIN Locations loc USING (unique_system_identifier)
  WHERE li.name LIKE '%INC.%'
  GROUP BY loc.location_city
  ORDER BY Cnt DESC
  LIMIT 15;`
  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    console.log(result);
    res.send({'message': "Advanced Query 2",'result': result});
  })

});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});