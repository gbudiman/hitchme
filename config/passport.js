var models = require('../models');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: '/login/facebook/callback',
  auth_type: 'reauthenticate',
  profileFields: ['id', 'email', 'displayName', 'link']
},

  function(access_token, refresh_token, profile, done) {
    process.nextTick(function() {
      //console.log(profile);
      models.user.findById(profile.id).then(function(user) {
        if (user) {

          console.log('exists');
          return done(null, user);
        } else {
          console.log('create new');
          var new_user = models.user.build({
            id: profile.id,
            token: access_token,
            name: profile.displayName,
            link: profile.profileUrl,
            email: profile.emails[0].value
          })

          

          new_user.save(function(err) {
            if (err) {
              throw err;
            }

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