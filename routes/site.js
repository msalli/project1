var express = require('express'),
    db = require('../models/index'),
    passport = require('passport'),
    passportLocal = require('passport-local'),
    router = express.Router();

  

  //set up pages

 //welcome page setup
  router.get('/', function (req, res) {
    res.render('index.ejs');
  });

  //homepage setup
  router.get('/home', function (req, res) {
    res.render('home', {
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    });
  });

  //set up sign up page
  router.get('/index/signup', function (req, res) {
    if(!req.user) {
      res.render('signup', {message: null});
    }
    else {
      res.redirect('/home');
    }
  });

  //form on signup page
  router.post('/signup', function (req, res) {
    db.user.createNewUser(req.body.firstname, req.body.lastname, req.body.username, req.body.password,
      function(err) {
        res.render('signup', {message: err.message, username: req.body.username});
      },
      function(success) {
        res.render('index', {message: success.message});
      });
  });

  //login page setup
  router.get('/index/login', function (req, res) {
    if(!req.user) {
      res.render('login', {message: null});
    }
    else {
      res.redirect('home');
    }
  });

  //form on login page
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: 'index/login',
    failureFlash: true
  }));


  //passport logout
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });



module.exports = router;