var express = require('express');
var router = express.Router();
var Window = require("../../models/queue/window.js");
var Q = require('q');
var ResData = require("../resdata.js");


router.post('/create', function(req, res) {	
	var name = req.body.name;	
	var window = new Window(null,name);
	window.createNewWindow()
		.then(function(status){
			var resdata;		
			if(status instanceof Error){
				resdata = new ResData(1, status.message);
			}else{
				resdata = new ResData(0, '', window);
			}
			resdata.sendJson(res);	
		});
});

router.post('/update', function(req, res) {	
	var name = req.body.name;	
	var id = req.body.id;	 
	var window = new Window(id, name);
	window.updateWindow()
		.then(function(status){
			var resdata;		
			if(status instanceof Error){
				resdata = new ResData(status, status.message);
			}else{
				resdata = new ResData(0, '', window);
			}
			resdata.sendJson(res);	
		});
});

router.post('/delete', function(req, res) {	
	var id = req.body.id;	 
	var window = new Window(id, null);
	window.deleteWindow()
		.then(function(status){
			var resdata;		
			if(status instanceof Error){
				resdata = new ResData(status.status, status.message);
			}else{
				resdata = new ResData(status.status);
			}
			resdata.sendJson(res);	
		});
});
router.get('/', function(req, res) {	
	Window.getAllWindows()
		.then(function(data){
			var resdata;		
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0,'',data);
			}
			resdata.sendJson(res);	
		});
});
router.get('/userwindow/:userid', function(req, res) {	
	var userid = req.param('userid');
	Window.getUserAvilableWindow(userid)
		.then(function(data){
			var resdata;		
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0,'',data);
			}
			resdata.sendJson(res);	
		});
});
router.get('/userwindow/getdetail/:userid', function(req, res) {	
	var userid = req.param('userid');
	Window.getUserAvilableWindowDetail(userid)
		.then(function(data){
			var resdata;		
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0,'',data);
			}
			resdata.sendJson(res);	
		});
});
router.post('/userwindow/update', function(req, res) {	
	var userid = req.body.userid;	
	var arrWindow = req.body.windowid;	
	
	Window.saveUserAvilableWindows(userid,  arrWindow)
		.then(function(data){
			var resdata;		
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0,'',data);
			}
			resdata.sendJson(res);	
		});
});

router.post('/userwindow/active', function(req, res) {	
	var userid = req.body.userid;	
	var windowid = req.body.windowid;
	var window = new Window(windowid,null);
	window.activeWindowOfUser(userid)
		.then(function(data){
			var resdata;		
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0,'',data);
			}
			resdata.sendJson(res);	
		});
});

module.exports = router;
