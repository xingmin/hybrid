var express = require('express');
var passport = require('passport');
var path = require('path');
var router = express.Router();
var Result = require('../result');
var auth = require('../../authlib/index');
var OpRoom = require('../../models/opsupport/oproom');

//get operation room
router.get('/',
	//auth.passport.authenticate('bearer', { session: false }),
	//auth.RBACMidware.can(rbac, 'list', 'role'),
	function(req, res) {
        var critiral = {
            deletedFlag: 0
        };
        OpRoom.find(critiral).exec()
        .then(
            function(rooms){
                res.json(new Result(0, '', rooms));
            },
            function(err){
                res.json(new Result(1, err.message));
            }
        );
	}
);

//create new operation room
router.post('/',
	//auth.passport.authenticate('bearer', { session: false }),
	//auth.RBACMidware.can(rbac, 'create', 'role'),
	function(req, res) {
		var name = req.body.name;
        var room = new OpRoom();
        room.name = name;
        room.save(function(err){
            var result = null;
            if(err){
                result = new Result(1, err, null);
            }else{
                result = new Result(0, 'save succeeded!',  room);
            }
            result.json();
        });
	}
);
//delete operation room
router.delete('/:name',
	//auth.passport.authenticate('bearer', { session: false }),
	//auth.RBACMidware.can(rbac, 'delete', 'role'),
	function(req, res) {
		var name = req.params.name;
        OpRoom.update({name: name, deletedFlag: 0}, {$set: {deletedFlag: 1}}, function(err){
            var result = null;
            if(err){
                result = new Result(1, err, null);
            }else{
                result = new Result(0, 'save delete succeeded!', null);
            }
            result.json();
        });
	}
);


module.exports = router;