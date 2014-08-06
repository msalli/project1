//all modules
var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models/index'),
    app = express(),

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
    tumblr = require('tumblr.js');
    
    //ROUTES
    // site = require('./routes/site'),
    // eva = require('./routes/eva');

    
app.set('view engine', 'ejs');
require('locus');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//AUTHORIZATION and AUTHENTICATION
app.use(cookieSession ({
  secret: 'thisismysecretkey',
  name: 'cookie created by Alli',
  maxage: 3000000
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



//ROUTES
// app.use(site);
// app.use(eva);

//prepare serialize
//will store user's id on login
passport.serializeUser(function (user, done) {
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

//prepare deserialize
passport.deserializeUser(function (id, done) {
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
    where: {
      id: id
    }
  }).done(function (error, user) {
    done(error, user);
  });
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

// set up function to get all tweets from user
  var getTweets = function (url, callback) {
    oauth.get(url, null, null, function (e, data, res){
      var allTweets = JSON.parse(data);
      callback(allTweets);
    });
  }; 
  

  //set up pages

 //welcome page setup
  app.get('/', function (req, res) {
    //check if user is logged in
    if(!req.user) {
      res.render('index');
    }
    else {
      res.redirect('/home');
    }
  });

  //homepage setup
  // app.get('/home', function (req, res) {
  //   if(!req.user) {
  //     res.render('login', {message: null, username: ''});
  //   }
  //   else {
  //     res.render('index');
  //   }
  // });


app.get('/eva/eva', function (req, res) {
  res.render('eva/eva');
});


//eva tweets page setup
  app.get('/eva/tweets', function (req, res) {
    var url = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=evachen212";
      getTweets(url, function (allTweets) {
      //eval(locus);
      res.render('eva/tweets', {tweets: allTweets});
    });
  });

//eva insta page set up
app.get('/eva/insta', function (req, res) {
  Instagram.users.recent({ user_id: 2098900,
    complete:function(user) {
      console.log(user);
      // eval(locus);
      res.render('eva/insta', {users: user});
    }});
});

  app.get('/home', function (req, res) {
    res.render('home', {
      isAuthenticated: req.isAuthenticated(),
      user: req.user
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
  app.get('/login', function (req, res) {
    //check if user is logged in
    if(!req.user) {
      res.render('login');
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


  //passport logout
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


app.listen(process.env.PORT || 3000, function() {
console.log("runnin shit on port 3000");
});

module.exports = app;