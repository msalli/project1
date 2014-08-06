    //all modules
var express = require('express'),
    bodyParser = require('body-parser'),

    //AUTHORIZATION AUTHENTICATION
    passport = require('passport'),
    passportLocal = require('passport-local'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    flash = require('connect-flash'),
    
    //API LIBRARIES
    request = require('request'),
    _ = require('lodash'),
    OAuth = require('oauth'),
    Instagram = require('instagram-node-lib'),
    tumblr = require('tumblr.js'),


    
    //ROUTES
    site = require('./routes/site'),
    eva = require('./routes/eva'),

    db = require('./models/index'),
    app = express();


app.set('view engine', 'ejs');
require('locus');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//AUTHORIZATION and AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(cookieSession ({
  secret: 'thisismysecretkey',
  name: 'cookie created by Alli',
  maxage: 1000000
}));


//ROUTES
app.use(site);
app.use(eva);

//prepare serialize
//will store user's id on login
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//prepare deserialize
passport.deserializeUser(function (id, done) {
  db.user.find({
    where: {
      id: id
    }
  }).done(function (error, user) {
    done(error, user);
  });
});


//set up sign up page
app.get('/index/signup', function (req, res) {
  if(!req.user) {
    res.render('signup', {message: null});
  }
  else {
    res.redirect('/home');
  }
});

//form on signup page
app.post('/signup', function (req, res) {
  db.user.createNewUser(req.body.firstname, req.body.lastname, req.body.username, req.body.password,
    function(err) {
      res.render('signup', {message: err.message, username: req.body.username});
    },
    function(success) {
      res.render('index', {message: success.message});
    });
});

//login page setup
app.get('/index/login', function (req, res) {
  if(!req.user) {
    res.render('login', {message: null});
  }
  else {
    res.redirect('/home');
  }
});

//form on login page
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));


//homepage setup
app.get('/home', function (req, res) {
  res.render('home', {
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

//passport logout
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/index');
});





//set up oauth connection
var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWITTER_KEY,
  process.env.TWITTER_SECRET,
  '1.0A',
  null,
  'HMAC-SHA1'
);

//set up js client for tumblr api
var client = tumblr.createClient({
  consumer_key: process.env.TUMBLR_KEY,
  consumer_secret: process.env.TUMBLR_SECRET,
  token: null,
  token_secret: null
});

//set up instagram library
Instagram.set('client_id', process.env.INSTAGRAM_KEY);
Instagram.set('client_secret', process.env.INSTAGRAM_SECRET);









app.listen(3000, function() {
console.log("runnin shit on port 3000");
});