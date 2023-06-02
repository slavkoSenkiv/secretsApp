//require packs
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./User');
const bcrypt = require('bcrypt');
const saltingRounds = 10;
const session = require('express-session');
const passport = require('passport');

//express, ejs, passport and session boilerplate
const app = express();
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'Our little secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
app.get('/login', (req, res)=>{
    res.render('login');
});
app.get('/register', (req, res)=>{
    res.render('register');
});
app.get('/secrets', (req, res)=>{
    if(req.isAuthenticated()){
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