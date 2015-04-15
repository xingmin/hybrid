function ResData(status,errmsg, obj){
	this.status = status;
	this.errmsg = errmsg;
	this.value = obj;
};

ResData.prototype.sendJson = function(res){
	res.setHeader('Content-Type','application/json;charset=utf-8');
	res.send(JSON.stringify(this));	
};

module.exports = ResData;