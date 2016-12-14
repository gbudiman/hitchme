var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
//var Strategy = require('passport-facebook').Strategy;
// var express = require('express');
// var router = express.Router();
// var models = require('../models');
var session_data;

var extract_minimum_user_data = function(d) {
  if (d == undefined) { return undefined; }
  
  return {
    name: d.user.name,
    id: d.user.id
  }
}

function is_authenticated(req, res, next) {
  if (req.user != undefined && req.user.id) {
    return next();
  }

  res.redirect('/login/facebook');
}

require('../config/passport.js');
/* GET home page. */
router
  .get('/', function(req, res, next) {
    res.render('index', { 
      title: 'Express',
      session_data: session_data 
    });
  })
  .get('/planner', is_authenticated, function(req, res, next) {
    session_data = extract_minimum_user_data(req);

    res.render('planner', { 
      title: 'Planner',
      session_data: session_data
    });
  })
  .get('/test_db', function(req, res, next) {
    models.user.findAll({

    }).then(function(users) {
      res.render('test_db', { 
        title: 'Test Database Connection',
        users: users
      });
    })
  })
  .get('/login/facebook',
    passport.authenticate('facebook'))
  .get('/login/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/planner',
      failureRedirect: '/'
    }))

module.exports = router;
