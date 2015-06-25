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

DrawDetail.deleteRecycleDetail = function(id){
    var defered = Q.defer();
    var conn = new sql.Connection(config.get('hybrid-sql'));

    var promise = customdefer.conn_defered(conn).then(function(conn){
        var request = new sql.Request(conn);
        request.input('Id', sql.Int, id);
        return customdefer.request_defered(request, 'proc_deleteRecycleDetailById');
    }).then(function(data){
        if(data.ret === 0){
            defered.resolve(true);
        }else{
            defered.reject(false);
        }
    },function(err){
        if (err) {
            console.log("executing proc_deleteRecycleDetailById Error: " + err.message);
        }
        defered.reject(err);
    });
    return defered.promise;
};
module.exports = DrawDetail;