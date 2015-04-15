var sql = require('mssql'); 

var config = {
   user: 'liuxingmin@172.30.244.81',
   password: 'xflxmin17',
   server: '172.30.244.67', // You can use 'localhost\\instance' to connect to named instance
database: 'chisdb_yszx'
}
 // var config = {
    // user: 'sa',
    // password: '123456',
    // server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
    // database: 'test'
// } 
function Patient(patient){
    this.id = patient.id;
    this.name = patient.name;
	this.consume = patient.consume;
};

module.exports = Patient;


//
Patient.getTodayConsume = function getTodayConsume(patientid, callback) {
	console.log("execting query");
	sql.connect(config, function(err) {
		// ... error checks
		if (err) {
			console.log("User_Sql Error: " + err.message);
			return;
		}
		// Query
		//var request = new sql.Request();
		//var qsql = "exec ysself_getPatientConsume '"+patientid+"'";
		//console.log(qsql);
		//request.query(qsql, function(err, recordset) {
			//if (err) {
				//console.log("getTodayConsume Error: " + err.message);
				//return;
			//}
			//callback(err, recordset);
		//});

		// Stored Procedure

		var request = new sql.Request();
		request.input('patientid', sql.Char(20), patientid);
		request.execute('ysself_getPatientConsume', function(err, recordsets, returnValue) {
			// ... error checks
			if (err) {
				console.log("getTodayConsume Error: " + err.message);
				return;
			}

			callback(err, recordsets);
		});
	});    

};

