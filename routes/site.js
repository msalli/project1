var express = require('express'),
    router = express.Router();

  //set up pages
  
  //welcome page setup
  router.get('/', function (req, res) {
    res.render('index.ejs');
  });

  //login page setup
  router.get('/index/login', function (req, res) {
    res.render('login');
  });

  //signup page setup
  router.get('/index/signup', function (req, res) {
    res.render('signup');
  });

  //home page setup
  // router.get('/home', function (req, res) {
  //   res.render('home');
  // });




module.exports = router;