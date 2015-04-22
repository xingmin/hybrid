var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');

function DrawDetail(obj){
    this.id = obj.id;
    this.drawId = obj.drawId;
    this.barcode = obj.barcode;
    this.useFlag = obj.useFlag;
    this.recycleId = obj.recycleId;
}

module.exports = DrawDetail;