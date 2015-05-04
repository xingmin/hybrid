var _ = require('lodash');
var User = require('../model/user');

var UserInfo  = function(info){
	this.userId = info.userId;
	this.userName = info.userName;
	this.legalName = info.legalName;
	this.password = info.password;
};
UserInfo.convertFromUsers = function(users){
	if(!_.isArray(users)){
		return new UserInfo({
			userId    : users.userId,
			userName  : users.username,
			legalName : users.legalname,
			password  : users.password
		});
	}
	var arrUserInfo = users.map(function(user){
		return new UserInfo({
			userId    : user.userId,
			userName  : user.username,
			legalName : user.legalname,
			password  : user.password
		});
	});
	return arrUserInfo;
};
UserInfo.prototype.convertToUser = function(){
	var user = new User({
		username  : this.userName,
		legalname : this.legalName,
		password  : this.password
	});
	return user;
};
module.exports = UserInfo;