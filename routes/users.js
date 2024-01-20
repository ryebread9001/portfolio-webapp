var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  let name = req.body.name
  console.log('req.session:', req.session)
  if (!Object.keys(req.session).includes('name')) {
      req.session.name = name 
  }
  res.send("Name Set");
});

module.exports = router;
