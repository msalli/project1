    //all modules
var express = require('express'),
    Instagram = require('instagram-node-lib'),
    bodyParser = require('body-parser'),
    request = require('request'),
    _ = require('lodash'),
    OAuth = require('oauth'),
    tumblr = require('tumblr.js'),
    
    //ROUTES
    site = require('./routes/site'),
    eva = require('./routes/eva'),
    app = express();


app.set('view engine', 'ejs');
require('locus');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(site);
app.use(eva);



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