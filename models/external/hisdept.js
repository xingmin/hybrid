var sql = require('mssql');
var Q = require('q');
var config = require('../config');
var _ = require('lodash');

function HisDept(opt){
    opt = opt || {};
    this.code = opt.code;
    this.name = opt.name;
    this.py = opt.py;
}
HisDept.ConvertFromDB = function(record){
    return new HisDept({
        code: record["code"],
        name: record["name"],
        py: record["py_code"]
    });
};

HisDept.getHisDeptList = function(unit){
    var defered = Q.defer();
    var connection = new sql.Connection(config.get('his'), function(err) {
        if(err){
            console.log("executing getHisDept Error: " + err.message);
            defered.reject(err);
            return;
        }
        var request = new sql.Request(connection);
        var sqlstatement = "select code, name, py_code from zd_unit_code";
        request.query(sqlstatement, function(err, recordset) {
            if(err){
                connection.close();
                console.log("executing getHisDeptList Error: " + err.message);
                defered.reject(err);
                return;
            }
            var result = null;
            result = _.map(recordset, function(record){
                return HisDept.ConvertFromDB(record);
            });
            connection.close();
            defered.resolve(result);
        });
    });
    return defered.promise;
};
module.exports = HisDept;