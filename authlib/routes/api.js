var express = require('express');
var passport = require('passport');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
    res.json({
    	msg: 'API is running'
    });
});

module.exports = router;
