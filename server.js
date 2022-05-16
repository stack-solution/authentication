var express = require('express')
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
const { sendStatus } = require('express/lib/response')
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

app.post('/profile', function (req, res) {
  res.send('hello world');
})

app.post('/idk', function(req,res){
  res.send(202)
})

app.post('/api/login', function (req, res) {
  User.findOne({'email': req.body.email, 'password': req.body.password}, (err, user)=>{
    if(err){
      res.send(err);
    }
    if(!user){
      res.send(404)
    }
    else{
      res.send({token: jwt.sign({email: user.email, username: user.username, id: user._id}, 'secretkey', {expiresIn: '120s'})});
    }
  })
})

function protected(req,res,next){
  if(req.user){
    console.log("Logged In")
    next()
  }else{
    console.log("not logged in")
    res.sendStatus({code: 404, message: "U are not logged in!"})
  }
}

app.use(function(req, res, next){
    if(req.headers.authorization == 1) console.log("Im in the middle");
    else if(req.headers.authorization == 2) console.log("Im an idiot");
    next()
  })


app.listen(3000)
console.log("Listening on http://localhost:3000")