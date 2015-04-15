var express = require('express');
var router = express.Router();
var ExternalSys = require("../../models/queue/externalsys.js");
var Q = require('q');
var ResData = require("../resdata.js");

router.post('/create', function(req, res) {
	var name = req.body.name;
	var py = req.body.pinyin;
	var easyId = req.body.easyid;
	var externalSys = new ExternalSys({name:name, pinyin:py, easyId:easyId});
	externalSys.createNewExternalSys()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(1, status.message);
			}else{
				resdata = new ResData(0, '', externalSys);
			}
			resdata.sendJson(res);
		});
});

router.post('/update', function(req, res) {
	var id = req.body.id;
	var name = req.body.name;
	var pinyin = req.body.pinyin;
	var easyId = req.body.easyid;
	var externalSys = new ExternalSys({id:id, name:name, pinyin:pinyin, easyId:easyId});
	externalSys.updateExternalSys()
		.then(function(status){
			var resdata;
			if(status instanceof Error){
				resdata = new ResData(status, status.message);
			}else{
				resdata = new ResData(0, '', externalSys);
			}
			resdata.sendJson(res);
		});
});

router.post('/delete', function(req, res) {
	var id = req.body.id;
	var externalSys = new ExternalSys({id:id});
	externalSys.deleteExternalSys()
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
	ExternalSys.prototype.getAllExternalSys()
		.then(function(data){
			var resdata;
			if(data instanceof Error){
				resdata = new ResData(data.status, data.message);
			}else{
				resdata = new ResData(0, '', data);
			}
			resdata.sendJson(res);
		});
});

router.get('/get/py/:py', function(req, res) {
	var pinyin = req.param('py');
	ExternalSys.prototype.getExternalSysByPinyin(pinyin)
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
