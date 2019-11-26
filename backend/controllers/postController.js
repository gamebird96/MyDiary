//var passport = require('passport');
var mongoose = require('mongoose');
var Post = require('../models/post');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.addPost = function(req, res) {

  console.log('adding post');
  var post = new Post();
  post.uname = req.body.uname;
  post.title = req.body.title;
  post.post = req.body.post;
  post.image = req.body.img;
  post.timestamp = req.body.timestamp;
  post.private = req.body.private;

  post.save().then(user => 
  {
    console.log(user._id);
    res.status(200).json({'post': 'Added successfully', 'id': user._id});
  }).catch(err => 
  {
    res.status(400).send('Failed to create new record');
  });
};

module.exports.removePost = function(req, res) {
  console.log('removing post');
  Post.deleteOne({ title: req.body.title, uname: req.body.uname}, (err)=> {
    if (!err) 
    {
      res.status(200).send({'post': 'Deleted successfully'});
    }
    else
    {
      res.status(400).send('Failed to delete record');
    }
  });
}