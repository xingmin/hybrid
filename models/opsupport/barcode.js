var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');
var config = require('../config');

function BarCode(opt){
    this.barCode = opt.barCode;
}

BarCode.getChargeInfoByBarCode = function(barCode){
    var defered = Q.defer();
    var conn = new sql.Connection(config.get('hybrid-sql'));
    var promise = customdefer.conn_defered(conn).then(function(conn){
        var request = new sql.Request(conn);
        request.input('BarCode', sql.VarChar(20), barCode);
        return customdefer.request_defered(request, 'proc_getBarCodeChargeInfo');
    }).then(function(data){
        var result = null;
        var record = data.recordset[0];
        if( record && record.length>0){
            result = record[0];
        }
        defered.resolve(result);
    },function(err){
        defered.reject(err);
    });
    return defered.promise;
};
module.exports = BarCode;