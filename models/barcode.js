var sql = require('mssql');
var customdefer = require('./customdefer');
var Q = require('q');
var config = require('./config');

function BarCode(opt){
    opt = opt || {};
    this.barCode = opt.barCode;
    this.inpatientNo = opt.inpatientNo;
    this.times = opt.times;
    this.name = opt.name;    
    this.chargeName = opt.chargeName;
    this.chargePrice = opt.chargePrice;
    this.chargeAmount = opt.chargeAmount;
    this.inputDate = opt.inputDate;
    this.inputOpera = opt.inputOpera;
}
BarCode.ConvertFromDB = function(record){
    return new BarCode({
        barCode: record["bar_code"],
        inpatientNo: record["inpatient_no"],
        times: record["times"],
        name: record["patient_name"],
        inputDate: record["input_date"],
        chargeName: record["charge_name"],
        chargePrice: record["charge_price"],
        chargeAmount: record["charge_amount"],
        inputOpera: record["input_opera"]
    });
};

BarCode.getChargeInfoByBarCode = function(barCode){
    var defered = Q.defer();
    var conn = new sql.Connection(config.get('his'));
    var promise = customdefer.conn_defered(conn).then(function(conn){
        var request = new sql.Request(conn);
        request.input('BarCode', sql.VarChar(20), barCode);
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