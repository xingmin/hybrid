function Result(code, message, value){
	this.code = code;
	this.message = message;
	this.value = value;
}
Result.prototype.json = function(res){
	res.json(this);
};
module.exports = Result;