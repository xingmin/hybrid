'use strict';


module.exports = function extendUser (schema, options) {
	options = options || {};

	schema.add({
		empcode        : { type: String },//工号
		legalNamePY    : { type: String },//姓名拼音首字母
		source         : { type:String }//来源
	});
};