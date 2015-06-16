var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');
var config = require('../config');
var _ = require('lodash');

function HisUser(opt){
    opt = opt || {};
    this.code = opt.code;
    this.name = opt.name;
    this.py = opt.py;
}
HisUser.ConvertFromDB = function(record){
    return new HisUser({
        code: record["code"],
        name: record["name"],
        py: record["py_code"]
    });
};

HisUser.getHisUserList = function(){
    var defered = Q.defer();
    var connection = new sql.Connection(config.get('his'), function(err) {
        if(err){
            console.log("executing getHisUser Error: " + err.message);
            defered.reject(err);
            return;
        }
        var request = new sql.Request(connection);
        var sqlstatement = "select code, name, py_code from a_employee_mi where dept_sn in('1050300') and isnull(deleted_flag,0)=0";
        request.query(sqlstatement, function(err, recordset) {
            if(err){
                connection.close();
                console.log("executing getHisUser Error: " + err.message);
                defered.reject(err);
                return;
            }
            var result = null;
            result = _.map(recordset, function(record){
                return HisUser.ConvertFromDB(record);
            });
            connection.close();
            defered.resolve(result);
        });
    });
    return defered.promise;
};
module.exports = HisUser;