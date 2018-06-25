const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const secretKey = require('./config').SECRET_KEY;

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = secretKey;

module.exports = passport => {
  passport.use(new JWTStrategy(options, (jwtPayload, done) => {
    User
      .findById(jwtPayload.id)
      .then(user => {
        if (user) return done(null, user);
        return done(null, false);
      })
      .catch(err => console.log(err));
  }))
}