var sql = require('mssql'); 

function Dept(id, branchid, code, layer, name,highid){
    this.id = branchid;
    this.branchid = branchid;
	this.code = code;
	this.layer = layer;
	this.name = name;
	this.highid = highid;
};

module.exports = Dept;

Dept.getDeptsByParts = function getDeptsByParts(str,
		callback) {
	var config = require('./connconfig').oa;
	sql.connect(config, function(err) {
		// ... error checks
		if (err) {
			console.log("User_Sql Error: " + err.message);
			return;
		}
		// Stored Procedure
		var request = new sql.Request();
		request.input('parts', sql.NVarChar(40), str);
		request.execute('xingmin_getDeptsByParts', function(err, recordsets, returnValue) {
			// ... error checks
			if (err) {
				console.log("executing xingmin_getDeptsByParts Error: " + err.message);
			}

			callback(err, recordsets[0]);
		});
	});    

};

