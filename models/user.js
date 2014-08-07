var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var passport = require('passport');
var passportLocal = require('passport-local');


module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
        }
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [6, 20]
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, //closing var User, second object
    {
      classMethods: {
        associate: function (db) {
          User.hasMany(db.influencer, {
            through: 'user_influencers'
          });
        },
        //encrypt pass
        encryptPass: function (password) {
          var hash = bcrypt.hashSync(password, salt);
          return hash;
        },
        //compare pass
        comparePass: function (userpass, dbpass) {
          return bcrypt.compareSync(userpass, dbpass);
        },
        //create new user
        createNewUser: function (firstname, lastname, username, password, err, success) {
          if (password.length < 6) {
            err({message: "Password must be more than 6 characters."});
          }
          else {
            User.create({
              firstname: firstname,
              lastname: lastname,
              username: username, //referencing param
              password: User.encryptPass(password) //password in () is param
            }).error(function(error) {
              console.log(error);
              if(error.firstname) {
                err({message: "You must enter your first name."});
              }
              if(error.lastname) {
                err({message: "You must enter your last name."});
              }
              if(error.username) {
                err({message: "You username must be at least 6 characters."});
              }
              else {
                err({message: "Oh snap. An account with that username already exists!"});
              }
            }).success(function (user) {
              success({message: "It's official! Go ahead and login."});
            });
          }
        } //closing createNewUser
      } //closing inner classMethods
    } //closing outer classMethods
  ); //closing User function

  //USER AUTHENTICATION
  passport.use(new passportLocal.Strategy({
    //un and pw need to match what is in ejs form
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //will use req as a param - allows us to do flash messages
  },
  function (req, username, password, done) {
    User.find({
      where: {
        username: username
      }
    }) //closing find
    //this done is not param, is from sequelize
    .done(function (error, user) {
      if (error) {
        console.log(error);
        //err: db issues
        return done(err, req.flash('loginMessage', 'Oops! Something went wrong!'));
      }
      if (user === null) {
        //null, false: user mess up
        return done(null, false, req.flash('loginMessage', 'Username does not exist.'));
      }
      if ((User.comparePass(password, user.password)) !== true) {
        return done(null, false, req.flash('loginMessage', 'Invalid password.'));
      }
      //calling out param callback
      //user: login success!
      done(null, user);
    }); //closing .done
  } //closing function
  )); //closing passport.use



  return User;
}; //closing module.exports function


