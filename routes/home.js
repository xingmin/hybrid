var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('../app/main.html', { });
});


module.exports = router;
