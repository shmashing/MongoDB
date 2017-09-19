var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname+"/views");
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/foxdb');

var FoxSchema = new mongoose.Schema({
  name: String,
  fur_color: String,
  dive_count: Number,
  kills: Number
}, {timestamps: true});

mongoose.model("Fox", FoxSchema);
var Fox = mongoose.model("Fox");

app.get('/foxes/new', function(request, response) {
  response.render('fox_form');
})
app.get('/', function(request, response) {
  Fox.find({}, function(err, foxes) {
    if(err) {
        console.log("Something went wrong");
    } else {
        response.render('index', {htmlfoxes: foxes});
    }
  })
})
app.post('/foxes', function(request, response) {
    var newFox = new Fox();
    newFox.name = request.body.name;
    newFox.fur_color = request.body.fur_color;
    newFox.dive_count = request.body.dive_count;
    newFox.kills = request.body.kills;

    console.log(newFox._id);
    newFox.save(function(err) {
        if(err){
            console.log("Something went wrong");
            response.redirect("/add_fox");
        } else {
            response.redirect('/');
        }
    });
})

app.listen(8000, function() {
  console.log("listening on port 8000");
})
