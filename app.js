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

  //to be deleted
  app.get('/eva/eva', function (req, res) {
    res.render('eva/eva', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
      });
  });


  //set up search page
  app.get('/eva/search', function (req, res) {
      res.render('eva/search');
    });

 //set up results page
  app.get('/resultstwit', function (req, res) {
    res.render('resultstwit');
  });

  //TWITTER search form
  app.get('/search', function (req, res) {
    var handle = req.query.handle;
    var url = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + handle;

    getTweets(url, function(allTweets) {
      res.render('resultstwit', {tweets: allTweets, handle: handle});
    });
  }); //closing app.post

  
  //set up instagram results page
  app.get('/resultsinsta', function (req, res) {
    res.render('resultsinsta');
  });

  //VICTORY!!!!!!!!!!!!!!!!!!!!!!
  //INSTAGRAM search form
  app.get('/searchinsta', function (req, res) {
    var name = req.query.insta;
    //find user by USERNAME
    Instagram.users.search({ q: name,
      complete:function(user) {
        var id = user[0].id;
        //WANT TO SET UP ERROR MESSAGE!!!!!

        //find user using ID FROM PREV
          Instagram.users.recent({ user_id: id,
            complete:function(userid) {
              console.log("THIS IS THE USERID", userid);
              // eval(locus);
              res.render('resultsinsta', {
                metadata: user,
                users: userid,
                insta: req.body.insta,
                isAuthenticated: req.isAuthenticated(),
                user: req.user
              });
            }});
        }});
     });

  //set up ALL results page
  //attempt to combine twitter and instagram into one page
  app.get('/results', function(req, res) {
    res.render('results');
  });

  //set up home page
  app.get('/home', function (req, res) {
    res.render('home', {
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    });
  });

  //SAVE TO FAVORITES: twitter pages
  app.post('/user_influencers/twitter/:handle', function (req, res) {
    var influencer = req.body.influencer;
    influencer.twitterhandle = req.params.handle;

    db.influencer.findOrCreate(influencer).success(function(influencer, created){
      db.user_influencers.create({
        userId: req.user.id,
        influencerId: influencer.id
      }).success(function(u_inf){
        res.redirect("/home");
      }).error(function(err){
        res.redirect('/search?handle' + req.params.handle);
      });
    })
    .error(function(err){
      res.redirect('/search?handle' + req.params.handle);
    });
  });

  //SAVE TO FAVORITES: instagram pages
  app.post('/user_influencers/insta/:insta', function (req, res) {
    var influencer = req.body.influencer;
    influencer.instagram = req.params.insta;

    db.influencer.findOrCreate(influencer).success(function(influencer, created) {
      db.user_influencers.create({
        userId: req.user.id,
        influencerId: influencer.id
      }).success(function(u_inf) {
        res.redirect("/home");
      }).error(function(err) {
        res.redirect('/search?insta' + req.params.insta);
      });
    })
    .error(function(err) {
      res.redirect('/search?insta' + req.params.insta);
    });
  });


  //ADD INFLUENCER form
  app.post('/add', function (req, res) {
    db.influencer.create({fullname: req.body.fullname, twitterhandle: req.body.twitterhandle, instagram: req.body.instagram})
      .error(function(err) {
        console.log("this is the err: ", err);
      })
      .success(function() {
        res.redirect('/home');
      });
  });

  //set up user profile
  //should be /profile:id ?
  app.get('/profile', function (req, res) {
    res.render('profile', {
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    });
  });

  //set up sign up page
  app.get('/signup', function (req, res) {
    if(!req.user) {
      res.render('signup', {message: null});
    }
    else {
      res.redirect('/home');
    }
  });

  //SIGNUP form
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

  //LOGIN form
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }));


  //logout
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


app.listen(process.env.PORT || 3000, function() {
console.log("runnin shit on port 3000");
});

module.exports = app;