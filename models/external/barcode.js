var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');
var config = require('../config');
var _ = require('lodash');

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
        return customdefer.request_defered(request, 'hybrid_getBarCodeChargeInfo');
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

BarCode.getChargeInfoCount = function(qstart, qend, barCode, inpatientNo, times){
    var defered = Q.defer();
    var conn = new sql.Connection(config.get('his'));
    var promise = customdefer.conn_defered(conn).then(function(conn){
        var request = new sql.Request(conn);
        request.input('qb', sql.DateTime, qstart);
        request.input('qe', sql.DateTime, qend);
        request.input('barcode', sql.VarChar(20), barCode);
        request.input('inpatient_no', sql.VarChar(6), inpatientNo);
        request.input('times', sql.Int, times);
        return customdefer.request_defered(request, 'hybrid_computeBarCodeCount');
    }).then(function(data){
        var result = data.ret;
        defered.resolve(result);
    },function(err){
        defered.reject(err);
    });
    return defered.promise;
};

BarCode.getChargeInfoList = function(qstart, qend, barCode, inpatientNo, times, pageNo, pageSize){
    var defered = Q.defer();
    var conn = new sql.Connection(config.get('his'));
    var promise = customdefer.conn_defered(conn).then(function(conn){
        var request = new sql.Request(conn);
        request.input('qb', sql.DateTime, qstart);
        request.input('qe', sql.DateTime, qend);
        request.input('barcode', sql.VarChar(20), barCode);
        request.input('inpatient_no', sql.VarChar(6), inpatientNo);
        request.input('times', sql.Int, times);
        request.input('PageNo', sql.Int, pageNo);
        request.input('PageSize', sql.Int, pageSize);
        return customdefer.request_defered(request, 'hybrid_getBarCodeChargeInfoList');
    }).then(function(data){
        var result = null;
        var records = data.recordset[0];
        var results = _.map(records, function(record){
            return BarCode.ConvertFromDB(record);
        });
        defered.resolve(results);
    },function(err){
        defered.reject(err);
    });
    return defered.promise;
};
module.exports = BarCode;