var sql = require('mssql');
var Q = require('q');
var config = require('../config');
var _ = require('lodash');

function OAEmp(opt){
    opt = opt || {};
    this.id = opt.id;
    this.name = opt.name;
    this.loginId = opt.loginId;
    this.empCode = opt.empCode;
    this.py = opt.py;
}
OAEmp.ConvertFromDB = function(record){
    return new OAEmp({
        id: record["EmpID"],
        name: record["Name"],
        loginId: record["LoginID"],
        empCode: record["EmpCode"],
        py: record["PinYin"]
    });
};

OAEmp.getOAEmpList = function(){
    var defered = Q.defer();
    var connection = new sql.Connection(config.get('oa'), function(err) {
        if(err){
            console.log("executing getOAEmpList Error: " + err.message);
            defered.reject(err);
            return;
        }
        var request = new sql.Request(connection);
        var sqlstatement = "select EmpID, Name, LoginID, EmpCode, LoginID as PinYin from mrBaseInf";//dbo.getPinYin(Name) as
        request.query(sqlstatement, function(err, recordset) {
            if(err){
                connection.close();
                console.log("executing getOAEmpList Error: " + err.message);
                defered.reject(err);
                return;
            }
            var result = null;
            result = _.map(recordset, function(record){
                return OAEmp.ConvertFromDB(record);
            });
            connection.close();
            defered.resolve(result);
        });
    });
    return defered.promise;
};
module.exports = OAEmp;