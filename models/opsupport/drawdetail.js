var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');
var config = require('../config');

function DrawDetail(obj){
    this.id = obj.id;
    this.drawId = obj.drawId;
    this.barcode = obj.barcode;
    this.useFlag = obj.useFlag;
    this.recycleId = obj.recycleId;
}
DrawDetail.getBarCodeStatus = function(barcode){
    var defered = Q.defer();
    var connection = new sql.Connection(config.get('hybrid-sql'), function(err) {
        if(err){
            console.log("executing getBarCodeStatus Error: " + err.message);
            defered.reject(err);
            return;
        }
        var request = new sql.Request(connection);
        var sqlstatement = "select dbo.func_getBarCodeStatus2('"+barcode+"') as status";
        request.query(sqlstatement, function(err, recordset) {
            if(err){
                connection.close();
                console.log("executing getBarCodeStatus Error: " + err.message);
                defered.reject(err);
                return;
            }
            var result = recordset[0].status;
            connection.close();
            defered.resolve(result);
        });
    });
    return defered.promise;
};
module.exports = DrawDetail;