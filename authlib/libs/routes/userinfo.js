var _ = require('lodash');
var User = require('../model/user');
//var PinYin = require('pinyin');

var UserInfo  = function(info){
	this.userId = info.userId;
	this.userName = info.userName;
	this.empCode = info.empCode || '';
	this.legalName = info.legalName;
	this.legalNamePY = info.legalNamePY || '';
	this.password = info.password;
	this.role = info.role;
};
UserInfo.convertFromUsers = function(users){
	if(!_.isArray(users)){
		return new UserInfo({
			userId       : users.userId,
			userName     : users.username,
			legalName    : users.legalname,
			password     : users.password,
			role         : users.role,
			legalNamePY  : users.legalNamePY,
			empCode      : users.empcode
		});
	}
	var arrUserInfo = users.map(function(user){
		return new UserInfo({
			userId       : user.userId,
			userName     : user.username,
			legalName    : user.legalname,
			password     : user.password,
			role         : user.role,
			legalNamePY  : user.legalNamePY,
			empCode      : user.empcode
		});
	});
	return arrUserInfo;
};
UserInfo.prototype.convertToUser = function(){
	var user = new User({
		username    : this.userName,
		legalname   : this.legalName,
		password    : this.password,
		role        : this.role,
		legalNamePY : this.legalNamePY,
		empcode     : this.empCode
	});
	return user;
};
module.exports = UserInfo;