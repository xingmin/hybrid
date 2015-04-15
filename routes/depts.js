var express = require('express');
var router = express.Router();
var dept = require("../models/depts.js");

router.get('/getdeptlist/:parts', function(req, res) {	
	var parts = req.param('parts');
	console.log(parts);
	
	dept.getDeptsByParts(parts,
		function(err, records){
			var rdepts=[];
			var record;
			var i=0;
			for(;i<records.length;i++){
				record = records[i];
				rdepts.push({
					"id":record.DepID,
					"branchid":record.BranchID,
					"code":record.DepCode,
					"layer":record.Layer,
					"name":record.Name,
					"higherid":record.HiDepID,
				})
			}
			res.setHeader('Content-Type','application/json;charset=utf-8');
			console.log(rdepts);
			res.send(JSON.stringify(rdepts));
			record=null;
			i=null;
	});	
});
module.exports = router;
