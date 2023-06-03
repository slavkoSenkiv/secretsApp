
const passport = require('passport');
const dotenv = require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  /* function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  } */
  function(request, accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));
passport.serializeUser((user, done)=>{
    done(null, user)
});