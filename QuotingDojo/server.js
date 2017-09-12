var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname+"/views");
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/quotesdb');

var QuoteSchema = new mongoose.Schema({
  name: String,
  quote: String
}, {timestamps: true});

mongoose.model("Quote", QuoteSchema);
var Quote = mongoose.model("Quote");

app.get('/', function(request, response) {
  response.render('index');
})
app.get('/quotes', function(request, response) {
  Quote.find({}, function(err, quotes){
    if(err){
      console.log("couldn't retrieve quotes");
    } else {
      response.render('quotes', {htmlquotes: quotes});
    }
  })

})
app.post('/add_quote', function(request, response) {
  let newQuote = new Quote();
  newQuote.name = request.body.user_name;
  newQuote.quote = request.body.quote;

  newQuote.save(function(err){
    if(err) {
      console.log("Something went wrong in saving the quote");
      response.redirect('/');
    } else {
      response.redirect('quotes');      
    }

  })
})

app.listen(8000, function() {
  console.log("listening on port 8000");
})
