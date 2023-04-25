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

app.post('/transaction', function(req, res) {
    
    var sql = `SELECT
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
    and L.email = 'djones@hbi.com';`
    console.log(sql);
    connection.query(sql, function(err, result) {
      if (err) {
        res.send(err)
        return;
      }
      console.log(result);
      res.send('<html><head><title>New Page</title></head><body><h1>New Page</h1><iframe src="https://www.google.com/maps/d/u/3/embed?mid=1jy4kINNsLBSc-wnzUyWzcB-8sAhMeA4&ehbc=2E312F" width="640" height="480"></iframe></body></html>');
      // res.send({'message': "transaction",'result': result});
    })
  
  });

app.listen(80, function () {
    console.log('Node app is running on port 80');
});

// import csv
// import simplekml

// def dms_to_dd(d, m, s):
//     try:
//         return float(d) + float(m) / 60 + float(s) / 3600
//     except (ValueError, TypeError):
//         return None

// def dms_to_dd1(d, m, s):
//     try:
//         return (float(d) + float(m) / 60 + float(s) / 3600)*-1
//     except (ValueError, TypeError):
//         return None

// def create_kml(input_file, output_file):
//     kml = simplekml.Kml()

//     with open(input_file, "r") as f:
//         reader = csv.DictReader(f)
//         for row in reader:
//             trans_dec_lat = dms_to_dd(row["trans_lat_degrees"], row["trans_lat_minutes"], row["trans_lat_seconds"])
//             trans_dec_long = dms_to_dd1(row["trans_long_degrees"], row["trans_long_minutes"], row["trans_long_seconds"])
//             rec_dec_lat = dms_to_dd(row["rec_lat_degrees"], row["rec_lat_minutes"], row["rec_lat_seconds"])
//             rec_dec_long = dms_to_dd1(row["rec_long_degrees"], row["rec_long_minutes"], row["rec_long_seconds"])

//             if trans_dec_lat and trans_dec_long and rec_dec_lat and rec_dec_long:
//                 coords = [(trans_dec_long, trans_dec_lat), (rec_dec_long, rec_dec_lat)]
//                 lin = kml.newlinestring(name=row["unique_system_identifier"], coords=coords)
//                 lin.style.linestyle.color = "ff0000ff"  # Red

//     kml.save(output_file)

// if __name__ == "__main__":
//     input_file = "exported_results.csv"
//     output_file = "output.kml"
//     create_kml(input_file, output_file)