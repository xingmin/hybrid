var express = require('express');
var path = require('path');
var router = express.Router();
var Result = require('../result');
var auth = require('../../authlib/index');
var OpRoom = require('../../models/opsupport/oproom');
var log = require('../../log')(module);
//get operation room
router.get('/',
	auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'list', 'oproom'),
	function(req, res) {
        var name = req.query.name;
        var critiral = {};
        if (name) { critiral.name = {$regex: '^'+name}; }
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
	auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'create', 'oproom'),
	function(req, res) {
		var name = req.body.name;
        var room = new OpRoom();
        room.name = name;
        room.save(function(err){
            var result = null;
            if(err){
                result = new Result(1, err.message, null);
                log.error(err.message);
            }else{
                result = new Result(0, 'save succeeded!',  room);
            }
            result.json(res);
        });
	}
);
//delete operation room
router.delete('/:name',
	auth.passport.authenticate('bearer', { session: false }),
	auth.RBACMidware.can(auth.rbac, 'delete', 'oproom'),
	function(req, res) {
		var name = req.params.name;
        //OpRoom.update({name: name, deletedFlag: 0}, {$set: {deletedFlag: 1}}, function(err){
        //    var result = null;
        //    if(err){
        //        result = new Result(1, err.message, null);
        //        log.error(err.message);
        //    }else{
        //        result = new Result(0, 'save delete succeeded!', null);
        //    }
        //    result.json(res);
        //});
        OpRoom.findOneAndRemove({name: name}, {}, function(err){
            var result = null;
            if(err){
                result = new Result(1, err, null);
            }else{
                result = new Result(0, 'save delete succeeded!', null);
            }
            res.json(result);
        });
	}
);


module.exports = router;