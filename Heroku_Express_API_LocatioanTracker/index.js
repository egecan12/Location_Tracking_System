//EGECAN
const express = require('express');
const path = require("path")
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var cors = require("cors");

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

mongoose.Promise = global.Promise;


// Mongo access
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;

var nameSchema = new mongoose.Schema({
    Latitude : Number,
    Longitude : Number,
  });
  
  
  
  var Coordinates = mongoose.model("Coordinates", nameSchema);




app.use(express.static(path.join(__dirname, "/")))


app.get('/getCoordsLocations', function(req, res, next) {
	Coordinates.find().limit(50).then(function(coords) {
    
    res.json(coords);

	});
});


app.post("/addCoordinates", (req, res) => {
  var myCoordinates = new Coordinates(req.body);
  myCoordinates.save()
      .then(item => {
          return res.redirect('/');

        })
      .catch(err => {
          res.status(400).send(err);
          
      });
});


app.get('/', (req, res) => res.send('Hello World!'));


app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));