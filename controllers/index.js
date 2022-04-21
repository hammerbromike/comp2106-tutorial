var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET home page. */
router.get('/sent', function(req, res, next) {
  res.render('sent', { title: 'Message Sent!' });
});

module.exports = router;
