var Q = require('q');
var customdefer=function(){
	
};

customdefer.conn_defered= function(conn){
	var defered = Q.defer();
	conn.connect(function(err){
		if(err){
			defered.reject(err);
		}else{
			defered.resolve(conn);
		}		
	});
	return defered.promise;
};
customdefer.request_defered = function(reqest, proc){
	var defered = Q.defer();
	reqest.execute(proc, function(err,recordsets, returnValue){
		if(err){
			defered.reject(err);
		}else{
			defered.resolve({'recordset': recordsets, 'ret': returnValue});
		}		
	});
	return defered.promise;
};

module.exports = customdefer;