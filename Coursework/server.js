const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/wheresmymovie";
const express = require('express'); //npm install express
const session = require('express-session'); //npm install express-session
const bodyParser = require('body-parser'); //npm install body-parser
const app = express();
const unirest = require("unirest"); // npm install unirest
//Loading the things we need

app.set('view engine', 'ejs');
//Setting the view engine to ejs
app.use(bodyParser.urlencoded({
  extended: true
  //Using the body-parser for post data
}));
app.use(express.static('public'));
//Looking in the public folder for static files
app.use(session({
  secret: 'example'
  //Telling express we're using sessions
}));
var db;
//Variable to store the database

MongoClient.connect(url, function(error, database) {
  if (error) {
    throw error;
    //If there's an error, throw it
  }
  db = database;
  //Storing the database in the variable
  app.listen(8080);
  //Telling the app to listen on port 8080
  console.log('8080 is the magic port.');
  //Displaying a message in the console
});

//-------------------- GET ROUTES --------------------

//Using res.render to load up an ejs view file:

//Index page
app.get('/', function(req, res) {
   //res.render('pages/index');
  var req = unirest("GET", "https://api.themoviedb.org/3/movie/popular");
  req.query({
    "api_key": "305a3b42d88760bd22c9f8c8c54f788d"
  });
  req.send("{}");
  req.end(function (result) {
    if (result.error) throw new Error(result.error);
    res.render('pages/index', {
      index: result.body.results
    });
  });
});

app.get('/library', function(req, res) {
  res.render('pages/library');
  //Library page
});

//Movie info page
app.get('/movieshowinfo', function(req, res) {
  var id = req.query.id;
  console.log(id);
  //this query finds the id of the movie that will be shown on the next page.
  var req = unirest("GET", "https://api.themoviedb.org/3/movie/" + id);
  req.query({
    "append_to_response": "credits",
  "api_key": "305a3b42d88760bd22c9f8c8c54f788d"
});
req.send("{}");
req.end(function (result) {
  if (result.error) throw new Error(result.error);
  console.log(result.body.original_title);
  res.render('pages/movieshowinfo', {
    movie: result.body
  });
});
});



app.get('/signuplogin', function(req, res) {
  res.render('pages/signuplogin');
  //Log in/sign up page
});

app.get('/search', function(req, res) {
  res.render('pages/search');
  //Log in/sign up page
});

//-------------------- POST ROUTES --------------------

app.post('/login', function(req, res) {
  console.log(JSON.stringify(req.body));
  var uname = req.body.loginformusername;
  var pword = req.body.loginformpassword;
  //Getting the username and password entered by the user
  db.collection('users').findOne({"username":uname}), function (error, result) {
    if (error) {
      throw error;
      //If there's an error, throw it
    }

    if (!result) {
      res.redirect('/login');
      return;
      //If there is no result matching the username, a new login page is generated
    }

    if (result.password == pword) {
      res.redirect('/library');
      //The user is redirected to their library
    } else {
      res.redirect('/login');
      return;
      //If there is no result matching the username, a new login page is generated
    }
  };
});

app.post('/dosearch', function(req, res) {
  console.log(JSON.stringify(req.body));
  var searchterm = req.body;
  //Getting the username and password entered by the user
});
