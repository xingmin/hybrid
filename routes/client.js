function Client(req){
	this.req = req;
}

Client.prototype.getClientIp = function(){
	var req = this.req;
	return req.headers['x-forwarded-for'] ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;
};

module.exports = Client;