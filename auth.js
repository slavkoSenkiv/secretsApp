const passport = require('passport');
const User = require('./User'); 
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    passReqToCallback: true
  },
  
  function(request, accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser((user, done)=>{
    done(null, user)
});

passport.deserializeUser((user, done) => {
  User.findById(user._id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});
