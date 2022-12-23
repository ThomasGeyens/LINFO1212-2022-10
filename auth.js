const {getUser} = require('./db');
const bcrypt = require('bcrypt');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

const salt = "$2b$10$XzJlrKQwqwFg4DZNXmmHPO";

module.exports = {
  salt,
}


//fonction qui permet de checker si l'user entre les bonnes informations
passport.use(new LocalStrategy(
  function (username, password, done) {
      getUser(username)
          .then(function (users) {
              if (!users) {
                  return done(null, false, { message: 'Incorrect username.' });
              }
              if (users.password == bcrypt.hashSync(password, salt)) {
                return done(null, users);
              }
              return done(null, false, { message: 'Incorrect password.' });
          })
          .catch(err => done(err));
  }  
));
 
//fonction qui permet de serializer le mdp du user
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username
    });
  });
});

//fonction qui permet de deserializer le mdp du user
passport.deserializeUser(function(id, done) {
  getUser(id.username).then(user => {
    done(null, user);
  }).catch(err => done(err));
});