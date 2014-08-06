var express = require('express'),
    _ = require('lodash'),
    OAuth = require('oauth'),
    Instagram = require('instagram-node-lib'),
    router = express.Router();



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



router.get('/eva/eva', function (req, res) {
  res.render('eva/eva');
});


//eva tweets page setup
  router.get('/eva/tweets', function (req, res) {
    var url = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=evachen212";
      getTweets(url, function (allTweets) {
      //eval(locus);
      res.render('eva/tweets', {tweets: allTweets});
    });
  });

//eva insta page set up
router.get('/eva/insta', function (req, res) {
  Instagram.users.recent({ user_id: 2098900,
    complete:function(user) {
      console.log(user);
      // eval(locus);
      res.render('eva/insta', {users: user});
    }});
});


module.exports = router;