var express = require('express')
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
require('./api/models/user.model')


var app = express() // the main app
var admin = express() // the sub app

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

User = mongoose.model('User');

mongoose.connect('mongodb://127.0.0.1/myauth', {useNewUrlParser: true});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("conncted to mongodb!")
});

app.post('/api/register', function (req, res) {
  let user = new User(req.body);
  user.save(function(err, user){
    if(err){
      res.send({code: 404, message: err});
    }else{
      return res.send(user);
    }
  })
}) 

app.get('/profile'), function (req, res, next) {
  if(req.user){
    res.send("Authenticated, Welcome!");
  }else{
    res.send("Ur not signed");
  }
}


app.post('/api/login', function (req, res) {
  User.findOne({'email': req.body.email, 'password': req.body.password}, (err, user)=>{
    if(err){
      res.send(err);
    }
    if(!user){
      res.send(404)
    }
    else{
      res.send({token: jwt.sign({email: user.email, username: user.username, id: user._id}, 'secretkey', {expiresIn: '30s'})});
    }
  })
})
/*
app.use(function(req, res, next){
  jwt.verify(req.headers.authorization, 'secretkey', (err, decoded)=>{
    if(err){
      //req.user = undefined;
      res.send(req.user);
    }else {
      //req.user = decoded;
      res.send(req.user);
    }
  })
})
*/

app.listen(3000)
console.log("Listening on http://localhost:3000")