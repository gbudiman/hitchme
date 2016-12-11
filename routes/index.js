var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
//var Strategy = require('passport-facebook').Strategy;
// var express = require('express');
// var router = express.Router();
// var models = require('../models');

require('../config/passport.js');
/* GET home page. */
router
  .get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  })
  .get('/planner', function(req, res, next) {
    res.render('planner', { title: 'Planner '});
  })
  .get('/test_db', function(req, res, next) {
    models.user.findAll({

    }).then(function(users) {
      res.render('test_db', { 
        title: 'Test Database Connection',
        users: users
      });
    })
  });

router.get('/login/facebook',
  passport.authenticate('facebook'));
router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/planner',
    failureRedirect: '/'
  }));

module.exports = router;
