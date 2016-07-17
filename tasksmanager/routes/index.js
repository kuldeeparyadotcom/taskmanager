var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var mongodb_hostname = process.env.HOST;
var mongodb_port = process.env.PORT;
var mongodb_username = process.env.USER;
var mongodb_password = process.env.PASSWORD;
var mongodb_database = process.env.DB;

//provide credentials like
//$ HOST=hostname PORT=port USER=user PASSWORD=password npm start

var options = {
  user: mongodb_username,
  pass: mongodb_password
}

//Connect to mongo db
mongoose.connect('mongodb://' + mongodb_hostname + ':' + mongodb_port + '/admin', options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() 
{
  console.log('We are connected!');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//display all tasks
router.get('/tasks/:user', function(req, res, next) {
  res.setHeader('Content-Type', 'text/html');
  res.send('Display all tasks for the user: ' + req.params.user );
});


//Provide details of a specific task
router.get('/task/:id', function(req, res){
  res.send('Display detailed view of given task: ' + req.params.id);
});


//Add a new task
router.post('/task/:user', function(req,res) {
  res.send('Post a task for logged in user ' + req.params.user );
});


//Update a given task
router.put('/task/:id', function(req, res) {
  res.send('Update the task for logged in user '  + req.params.id  );
});


//Delete a given task
router.delete('/task/:id', function(req, res) {
  res.send('Delete the given task ' + req.params.id );
});

module.exports = router;
