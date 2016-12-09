var facebook_strategy = require('passport-facebook').Strategy;
var config_auth = require('./auth');

module.exports = function(passport) {
  passport.serialize_user(function(user, done) {
    done(null user.id);
  })

  passport.deserialize_user(function(id, done) {
    console.log('not yet implemented');
  })

  passport.use(new FacebookStrategy({
    clientID: config_auth.facebook_auth.client_id,
    clientSecret: config_auth.facebook_auth.client_secret,
    callbackURL: config_auth.facebook_auth.callback_url
  },

  function(token, refresh_token, profile, done) {
    process.nextTick(function() {

    })
  }))
}