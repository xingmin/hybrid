var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');
var config = require('../config');

function HisUser(opt){
    opt = opt || {};
}
HisUser.ConvertFromDB = function(record){
    return new HisUser({
        barCode: record["bar_code"]
    });
};

HisUser.getHisUser = function(){
    var defered = Q.defer();
    var conn = new sql.Connection(config.get('his'));
    var promise = customdefer.conn_defered(conn).then(function(conn){
        var request = new sql.Request(conn);
        return customdefer.request_defered(request, 'proc_getBarCodeChargeInfo');
    }).then(function(data){
        var result = null;
        var record = data.recordset[0];
        if( record && record.length>0){
            result = BarCode.ConvertFromDB(record[0]);
        }
        defered.resolve(result);
    },function(err){
        defered.reject(err);
    });
    return defered.promise;
};
module.exports = BarCode;