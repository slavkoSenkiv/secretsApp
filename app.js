//packs boilerplate
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./User');
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
const bcrypt = require('bcrypt');
const saltingRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

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

app.post('/register', (req, res)=>{
    bcrypt.hash(req.body.password, saltingRounds, (err, hash)=>{
        
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save()
        .then(()=>{
            console.log('passed input');
            res.render('secrets');
        })
        .catch((error)=>{
            console.log(error);
        });
    })
    
});

app.post('/login', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log('hashed pass from login', password);

    User.findOne({email: username})
        .then((foundUser)=>{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, (err, result)=>{
                    if(result==true){
                        res.render('secrets');
                    }else{
                        console.log(err);
                    }
                });
            }else{
                res.send('invalid password');
                console.log('invalid password');
            };
        })
        .catch((error)=>{
            res.send('invalid login');
            console.log(error);
        });
});

app.listen(3000, ()=>{
    console.log('server is up and listedning to port 3000');
});