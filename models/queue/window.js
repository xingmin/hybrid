var sql = require('mssql'); 
var customdefer = require('../customdefer');

function Window(id,name, isactive){
    this.id = id;
    this.name = name;
    this.isactive = isactive;
};

//Window.prototype.getQueueClassByPinyin = function(py){
//	var config = require('../connconfig').queue;
//	
//	var conn = new sql.Connection(config);
//
//	var promise = customdefer.conn_defered(conn).then(function(conn){
//		var request = new sql.Request(conn);	
//		request.input('pinyin', sql.VarChar(100), py);	
//		return customdefer.request_defered(request, 'proc_getQueueClassByPinyin');
//	}).then(function(data){
//		var arrQueueClass = [];
//		data.recordset[0].forEach(function(value){
//			arrQueueClass.push((new Window( value.Id,value.Name)));
//		});
//		return arrQueueClass;
//	},function(err){
//		if (err) {
//			console.log("executing proc_addQueueClass Error: " + err.message);
//			return err;
//		}
//	});
//	return promise;
//};


Window.prototype.createNewWindow = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('name', sql.NVarChar(50), that.name);		
		return customdefer.request_defered(request, 'proc_addWindow');
	}).then(function(data){
		that.id = data.recordset[0][0].Id;
		return that;
	},function(err){
		if (err) {
			console.log("executing proc_addWindow Error: " + err.message);
			return err;
		}
	});
	return promise;
};

Window.prototype.updateWindow = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);	
		request.input('name', sql.NVarChar(50), that.name);		
		return customdefer.request_defered(request, 'proc_updateWindow');
	}).then(function(data){
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_updateWindow Error: " + err.message);
			return err;
		}
	});
	return promise;
};

Window.prototype.deleteWindow = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;
	
	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);
		request.input('id', sql.Int, that.id);		
		return customdefer.request_defered(request, 'proc_deleteWindow');
	}).then(function(data){
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_deleteWindow Error: " + err.message);
			return err;
		}
	});
	return promise;
};

Window.getAllWindows = function(){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		return customdefer.request_defered(request, 'proc_getWindowList');
	}).then(function(data){
		var arrWindow = [];
		data.recordset[0].forEach(function(value){
			arrWindow.push((new Window( value.Id,value.Name)));
		});
		return arrWindow;
	},function(err){
		if (err) {
			console.log("executing proc_getWindowList Error: " + err.message);
			return err;
		}
	});
	return promise;
};
Window.getUserAvilableWindow = function(userid){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('userid', sql.Int, userid);	
		return customdefer.request_defered(request, 'proc_getUserAvilableWindow');
	}).then(function(data){
		var arrWindow = [];
		data.recordset[0].forEach(function(value){
			arrWindow.push(value.WindowId);
		});
		return arrWindow;
	},function(err){
		if (err) {
			console.log("executing proc_getUserAvilableWindow Error: " + err.message);
			return err;
		}
	});
	return promise;
};
Window.getUserAvilableWindowDetail = function(userid){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('userid', sql.Int, userid);	
		return customdefer.request_defered(request, 'proc_getUserAvilableWindowDetail');
	}).then(function(data){
		var arrWindow = [];
		data.recordset[0].forEach(function(value){
			arrWindow.push(new Window( value.WindowId, value.WindowName,(value.IsActive==1?true:false)));
		});
		return arrWindow;
	},function(err){
		if (err) {
			console.log("executing proc_getUserAvilableWindow Error: " + err.message);
			return err;
		}
	});
	return promise;
};
Window.saveUserAvilableWindows = function(userid,arrWindowId){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('UserId', sql.Int, userid);	
		request.input('WindowIds', sql.VarChar(8000), ','+arrWindowId.join(',')+',');
		console.log(','+arrWindowId.join(',')+',')
		return customdefer.request_defered(request, 'proc_saveUserAvilableWindow');
	}).then(function(data){
		if(data.ret != 0){
			console.log("executing proc_saveUserAvilableWindow Error: " + data.recordset[0].errmsg);
		}
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_saveUserAvilableWindow Error: " + err.message);
			return err;
		}
	});
	return promise;
};
Window.prototype.activeWindowOfUser = function(userid){
	var config = require('../connconfig').queue;
	
	var conn = new sql.Connection(config);
	var that = this;

	var promise = customdefer.conn_defered(conn).then(function(conn){
		var request = new sql.Request(conn);	
		request.input('UserId', sql.Int, userid);	
		request.input('WindowId', sql.Int, that.id);
		return customdefer.request_defered(request, 'proc_setUserActiveWindow');
	}).then(function(data){
		if(data.ret != 0){
			console.log("executing proc_setUserActiveWindow Error: " + data.recordset[0].errmsg);
		}
		return {status:data.ret};
	},function(err){
		if (err) {
			console.log("executing proc_setUserActiveWindow Error: " + err.message);
			return err;
		}
	});
	return promise;
};

module.exports = Window;