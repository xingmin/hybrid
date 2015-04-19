var sql = require('mssql');
var customdefer = require('../customdefer');
var Q = require('q');

function Recycle(obj){
    this.id = obj.id;
    this.drawId = obj.drawId;
    this.barcode = obj.barcode;
    this.useFlag = obj.useFlag;
    this.recyleId = obj.recyleId;
}

module.exports = DrawDetail;