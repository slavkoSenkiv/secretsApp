const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./User');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//mongoose boilerplate
const url = "mongodb://127.0.0.1:27017/usersDB"; 
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('mongoose connection to local db is successful'))
.catch((error) => console.error('Error connecting to local db:', error));

app.get('/', (req, res)=>{
    res.render('home');
});
app.get('/login', (req, res)=>{
    res.render('login');
});
app.get('/register', (req, res)=>{
    res.render('register');
});

app.listen(3000, ()=>{
    console.log('server is up and listedning to port 3000');
});