var express = require('express')
var mongoose = require('mongoose')
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
  const user = new User(req.body);
  user.save(function(err, user){
    if(err){
      console.log(err);
      res.sendStatus(404);
    }else{
      return res.send(user);
    }
  })
})


app.listen(3000)
console.log("Listening on http://localhost:3000")