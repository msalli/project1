var express = require('express'),
    Instagram = require('instagram-node-lib'),
    bodyParser = require('body-parser'),
    request = require('request'),
    _ = require('lodash'),
    OAuth = require('oauth'),
    tumblr = require('tumblr.js'),
    //ROUTES
    site = require('./routes/site'),
    app = express();


app.set('view engine', 'ejs');
require('locus');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(site);

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
    // console.log("This is all tweets", allTweets);
    // console.log("This is data", data);
    callback(allTweets);
  });
}; //closing for getTweets


  //set up pages
  
  //welcome page setup
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  //login page setup
  app.get('/index/login', function (req, res) {
    res.render('login');
  });

  //signup page setup
  app.get('/index/signup', function (req, res) {
    res.render('signup');
  });

  //home page setup
  app.get('/home', function (req, res) {
    res.render('home');
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




    app.listen(3000, function() {
      console.log("runnin shit on port 3000");
    });