var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
const fs = require('fs')
var path = require('path');
var connection = mysql.createConnection({
                host: '34.134.82.72',
                user: 'root',
                password: 'LowerDecksFTW',
                database: 'primaryset',
                multipleStatements: true
});

connection.connect;

var app = express();
// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

const { DOMParser } = require('xmldom');
const toGeoJSON = require('togeojson');

function dmsToDD(degrees, minutes, seconds) {
  return parseFloat(degrees) + parseFloat(minutes) / 60 + parseFloat(seconds) / 3600;
}

app.get('/show-paths', function (req, res) {
  let emailAddresses = req.query.emails.split(','); // extract email addresses from query parameter
  let emailRegex = '^(' + emailAddresses.join('|') + ')$'; // create regex pattern from email addresses
  const sql = `SELECT
    L.unique_system_identifier,
    C1.lat_degrees AS trans_lat_degrees,
    C1.lat_minutes AS trans_lat_minutes,
    C1.lat_seconds AS trans_lat_seconds,
    C1.long_degrees AS trans_long_degrees,
    C1.long_minutes AS trans_long_minutes,
    C1.long_seconds AS trans_long_seconds,
    C2.lat_degrees AS rec_lat_degrees,
    C2.lat_minutes AS rec_lat_minutes,
    C2.lat_seconds AS rec_lat_seconds,
    C2.long_degrees AS rec_long_degrees,
    C2.long_minutes AS rec_long_minutes,
    C2.long_seconds AS rec_long_seconds
FROM
    License L
JOIN
    Path P
    ON L.unique_system_identifier = P.unique_system_identifier
JOIN
    Locations L1
    ON P.transmit_location_number = L1.location_number AND L1.unique_system_identifier = P.unique_system_identifier
JOIN
    Locations L2
    ON P.receiver_location_number = L2.location_number AND L2.unique_system_identifier = P.unique_system_identifier
JOIN
    Coordinate C1
    ON L1.id = C1.id
JOIN
    Coordinate C2
    ON L2.id = C2.id
WHERE
    P.path_type_desc = 'Fixed Point-to-Point'
    AND L.email REGEXP ?`;
  connection.query(sql, [emailRegex], function (err, result){
    if (err) {
      res.send(err);
      return;
    }
    let kmlString = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>';

    result.forEach((row) => {
      const transDecLat = dmsToDD(row.trans_lat_degrees, row.trans_lat_minutes, row.trans_lat_seconds);
      const transDecLong = -dmsToDD(row.trans_long_degrees, row.trans_long_minutes, row.trans_long_seconds);
      const recDecLat = dmsToDD(row.rec_lat_degrees, row.rec_lat_minutes, row.rec_lat_seconds);
      const recDecLong = -dmsToDD(row.rec_long_degrees, row.rec_long_minutes, row.rec_long_seconds);
      kmlString += `<Placemark>
        <name>${row.unique_system_identifier}</name>
        <styleUrl>#line-1</styleUrl>
        <LineString>
          <coordinates>${transDecLong},${transDecLat} ${recDecLong},${recDecLat}</coordinates>
        </LineString>
      </Placemark>`;
    });
    kmlString += '</Document></kml>';
    const parser = new DOMParser();
    const kml = parser.parseFromString(kmlString, 'text/xml');
    const geojson = toGeoJSON.kml(kml);
    res.send({ geojson });
  });
});


app.get('/', function(req, res) {
  res.render('index', {title: 'HFTracer'});
});

app.post('/deleteCascade', function(req, res) {
  var usi = req.body.deleteusicascade;
  var sql = `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  START TRANSACTION;
  DROP TABLE IF EXISTS t1,t2,t3;
  CREATE TABLE t1 (
    SELECT DISTINCT id FROM Locations WHERE unique_system_identifier = ${usi});
  CREATE TABLE t2 (
    SELECT DISTINCT id FROM Locations loc
    WHERE id IN ( SELECT id FROM t1 ) AND loc.unique_system_identifier != ${usi});
  CREATE TABLE t3 (
    SELECT id FROM t1
      WHERE id NOT IN	(SELECT id FROM t2)  );
  DELETE FROM License WHERE unique_system_identifier = ${usi};
  COMMIT;
  SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`
  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    };
    res.send({'message': "Deleted Record from License, Path, Locations with usi "+usi + ", and also record from Coordinate that has no connection to any Record from Locations", 'result':result});
    console.log(result);
  })
});

app.post('/insert', function(req, res) {
  var usi = req.body.insertusi;
  var name = req.body.insertname;
  var email = req.body.insertemail;
  var street = req.body.insertstreet;
  var city = req.body.insertcity;
  var state = req.body.insertstate;
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
  var aqlocation1 = req.body.aqlocation1;
  var aqlocation2 = req.body.aqlocation2;
  var sql = `SELECT DISTINCT License.name
  FROM License NATURAL JOIN Path JOIN Locations ON Locations.location_number = Path.transmit_location_number
  WHERE Locations.location_city = '${aqlocation1}'
  UNION
  SELECT DISTINCT License.name
  FROM License NATURAL JOIN Path JOIN Locations ON Locations.location_number = Path.receiver_location_number
  WHERE Locations.location_city = '${aqlocation2}'
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
  var namelike = req.body.namelike;
  var sql = `SELECT loc.location_city, COUNT(*) as Cnt
  FROM License li JOIN Locations loc USING (unique_system_identifier)
  WHERE li.name LIKE '%${namelike}%'
  GROUP BY loc.location_city
  ORDER BY Cnt DESC
  LIMIT 30;`
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