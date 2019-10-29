const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const sql = require('./settings');

/* SECRET */
var server_secret = 'this is extremely secret!';

passport.use(new LocalStrategy(
  function(email, password, done) {
    return sql("SELECT * FROM mgr.sysUser where email='andi@ifca.co.id' AND password='6DA0A73C8369617023020EDA2AF4D43F' ", {user: email, pass: password}).then(result => {
        if (result !== null)
        return done(null, result[0]);
      else
        return done(null, false);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = {
  passport: passport,
  check: expressJwt({secret: server_secret}),
  generateToken(user) {
    return jwt.sign({
      user: user
    }, server_secret, {
      expiresIn: 120 * 60
    });
  }
}
