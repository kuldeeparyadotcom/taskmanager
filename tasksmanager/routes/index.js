var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var mongodb_hostname = process.env.HOST;
var mongodb_port = process.env.MONGOPORT; //Don't use PORT as it is used for node port
var mongodb_username = process.env.USER;
var mongodb_password = process.env.PASSWORD;
var mongodb_database = process.env.DB;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//provide credentials like
//$ HOST=hostname MONGOPORT=port USER=user PASSWORD=password npm start

var options = {
  user: mongodb_username,
  pass: mongodb_password
}

//Connect to mongo db
mongoose.connect('mongodb://' + mongodb_hostname + ':' + mongodb_port + '/admin', options);

//Schema and Model
var tasksSchema = null;
var Task = null;
var connectionStatus = null;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() 
{
  console.log('We are connected!');
  connectionStatus = 'connected';

  tasksSchema = mongoose.Schema({
    task: String,
    user: String,
    priority: Number,
    iscompleted: Boolean
  });
console.log('Schema tasksSchema created!');

Task = mongoose.model('Tasks', tasksSchema);
console.log('Model Task is created');
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
   if (connectionStatus === 'connected') {
      console.log('Trying to add a new task');
      console.log(req.body);
      console.log(req.body.task);
      console.log(req.body.priority);
     var task = new Task({
        //task: 'Enjoy Priority',
        user: req.params.user,
        task: req.body.task,
        //priority: 1,
        priority: req.body.priority,
        iscompleted: false
      });

      //Save to Mongo DB only if all request parametes are present in JSON body
      if ( req.body.task !== undefined && req.body.priority !== undefined) {
        task.save(function(err, task) {
        if (err) return console.error(err);
        console.log(task);
        });
      }else {
        console.log('Task and Priority must be provided to save data to Mongo!');
      }

  } else {
    console.log('No Database Connectivity!')
  }

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
