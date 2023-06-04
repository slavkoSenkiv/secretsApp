//require packs
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./User');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltingRounds = 10;
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//express, ejs, passport and session boilerplate
const app = express();
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401);
}

app.use(session({
    secret: 'Our little secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



//mongoose boilerplate
const url = "mongodb://127.0.0.1:27017/usersDB"; 
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('mongoose connection to local db is successful'))
.catch((error) => console.error('Error connecting to local db:', error));

//get methods
app.get('/', (req, res)=>{
    res.render('home');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secrets');
  });

app.get('/login', (req, res)=>{
    res.render('login');
});

app.get('/register', (req, res)=>{
    res.render('register');se
});

app.get('/secrets', isLoggedIn, (req, res)=>{
    if(req.isAuthenticated()){
        let name = req.user.displayName;
        console.log(`hello ${name}`);
        res.render('secrets');
    }else{
        res.redirect('/login');
    }
});

app.get("/logout", function(req, res) {
    req.logout((err)=>{
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });
});

app.post('/register', (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;

    User.register({username: username}, password, (err, user)=>{
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            passport.authenticate('local')(req, res, ()=>{
                res.redirect('/secrets');
            });
        };
    });
    
});

app.post('/login', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const user = new User ({
        username: username, 
        password: password
    })

    req.login(user, (err)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate('local')(req, res, ()=>{
                res.redirect('/secrets');
            })
        }
    })
});

app.listen(3000, ()=>{
    console.log('server is up and listedning to port 3000');
});