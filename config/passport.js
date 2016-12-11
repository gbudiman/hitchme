var models = require('../models');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3001/login/facebook/callback',
  auth_type: 'reauthenticate',
  profileFields: ['id', 'email', 'displayName', 'link']
},

  function(access_token, refresh_token, profile, done) {
    process.nextTick(function() {
      //console.log(profile);
      console.log('ticking');
      models.user.findById(profile.id).then(function(user) {
        if (user) {

          console.log('exists');
          return done(null, user);
        } else {
          var new_user = models.user.build({
            id: profile.id,
            token: access_token,
            name: profile.displayName,
            link: profile.profileUrl.split(/\//).slice(-2)[0],
            email: profile.emails[0].value
          })

          new_user.save().then(function() {
            return done(null, new_user);
          })
        }
      })
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})