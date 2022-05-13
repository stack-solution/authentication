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
      console.log(err);
      res.send({code: 404, message: err});
    }else{
      return res.send(user);
    }
  })
}) 

app.post('/profile'), function (req, res, next) {
  if(req.user){
    res.sendStatus({code: 202, message: req.user});
  }else{
    res.sendStatus({code: 404, message: "Not Authenticated"});
  }
}


app.post('/api/login', function (req, res) {
  User.findOne({email: req.body.email}, function (err, myUser){
    if(err) res.status(404);
    res.status(202);
  })
})

app.use(function(req,res,next){
  console.log("moving");
  res.send(202);
})


app.listen(3000)
console.log("Listening on http://localhost:3000")