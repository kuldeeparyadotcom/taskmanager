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
    user: String,
    task: String,
    priority: Number,
    iscompleted: Boolean
  });
console.log('Schema tasksSchema created!');

Task = mongoose.model('Tasks', tasksSchema);
console.log('Model Task is created');
});

//display all tasks
router.get('/tasks/:user', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var received_user = req.params.user;
  Task.find( { user: received_user },function(err, tasks) {
    if (err) return console.error(err);
    console.log(tasks);
    //var user_tasks = JSON.stringify(tasks);

    //res.setHeader('Content-Type', 'application/json');
    console.log(tasks);
    res.json(tasks);
  })

});


//Provide details of a specific task
router.get('/task/:id', function(req, res){
  var received_id = req.params.id;
  Task.find( { _id: received_id }, function(err, task) {
    if (err) return console.error(err);
    console.log(task);
    //var specific_task = JSON.stringify(task);

    //res.setHeader('Content-Type', 'application/json');
    console.log(task);
    res.json(task);
  })
  //res.send('Display detailed view of given task: ' + req.params.id);
});


//Add a new task
router.post('/task', function(req,res) {
   if (connectionStatus === 'connected') {
      console.log('Trying to add a new task');
      console.log(req.body);
      console.log(req.body.user);
      console.log(req.body.task);
      console.log(req.body.priority);
      console.log(req.body.iscompleted);
     var task = new Task({
        user: req.body.user,
        task: req.body.task,
        priority: req.body.priority,
        iscompleted: req.body.iscompleted
      });

      //Save to Mongo DB only if all request parametes are present in JSON body
      if ( req.body.task !== undefined && req.body.priority !== undefined && req.body.user !== undefined && req.body.iscompleted !== undefined ) {
        task.save(function(err, task) {
        if (err) return console.error(err);
        console.log(task);
        res.json(task);
        });
      }else {
        console.log('Task and Priority must be provided to save data to Mongo!');
      }

  } else {
    console.log('No Database Connectivity!')
  }

});


//Update a given task
router.put('/task', function(req, res) {
  var received_id = req.body.id;
  console.log('received_id: ' + received_id);

  Task.findById(received_id, function(err, task) {
    if (err) return console.error(err);
    
    //Update task description if it is provided in body
    if (req.body.task !== undefined) {
      task.task = req.body.task;
    } else {
      console.log('task description is not to be updated');
    }

    //Update task priority if provided in body
    if (req.body.priority !== undefined) {
      task.priority = req.body.priority;
    } else {
      console.log('task priority is not to be updated');
    }

    //Update iscompleted task status only if provided in body
    if (req.body.iscompleted !== undefined) {
      task.iscompleted = req.body.iscompleted;
    } else {
      console.log('task completion status is not to be updated');
    }

    //Save and return updated document
    task.save(function(err) {
      if (err) return console.error(err);
      res.json(task);
    });

  });

});


//Delete a given task
router.delete('/task', function(req, res) {
  var received_id = req.body.id;
  console.log('received_id: ' + received_id);
  
   Task.findById(received_id, function(err, task) {
    if (err) return console.error(err);

    if (task !== null) {
      task.remove(function(err, deleted_task) {
        if (err) return console.error(err);
        console.log('Document removed: ' + deleted_task);
        res.send(deleted_task);
      });
    }else {
      console.log('Invalid Task ID provided!');
      res.send('Invalid Task ID provided!');
    }
    //remove requested task (document from mongoose db)

   });
  //res.send('Delete the given task ' + req.body.id );
});

module.exports = router;
