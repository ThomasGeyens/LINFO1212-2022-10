const {getUser} = require('./db');
const bcrypt = require('bcrypt');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

const salt = "$2b$10$XzJlrKQwqwFg4DZNXmmHPO";

module.exports = {
  salt
}

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
  
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username
    });
  });
});

passport.deserializeUser(function(id, done) {
  getUser(id.username).then(user => {
    done(null, user);
  }).catch(err => done(err));
});