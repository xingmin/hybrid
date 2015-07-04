var sql = require('mssql');
var Q = require('q');
var config = require('../config');
var _ = require('lodash');

function OADept(opt){
    opt = opt || {};
    this.id = opt.id;
    this.name = opt.name;
    this.py = opt.py;
}
OADept.ConvertFromDB = function(record){
    return new HisDept({
        id: record["DeptId"],
        name: record["Name"],
        py: record["PinYin"]
    });
};

OADept.getOADeptList = function(){
    var defered = Q.defer();
    var connection = new sql.Connection(config.get('oa'), function(err) {
        if(err){
            console.log("executing getOADeptList Error: " + err.message);
            defered.reject(err);
            return;
        }
        var request = new sql.Request(connection);
        var sqlstatement = "select DeptId, Name, dbo.getPinYin(Name) as PinYin from mrDep";
        request.query(sqlstatement, function(err, recordset) {
            if(err){
                connection.close();
                console.log("executing getOADeptList Error: " + err.message);
                defered.reject(err);
                return;
            }
            var result = null;
            result = _.map(recordset, function(record){
                return OADept.ConvertFromDB(record);
            });
            connection.close();
            defered.resolve(result);
        });
    });
    return defered.promise;
};
module.exports = OADept;