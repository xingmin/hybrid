var passport = require('passport');
var rbac = require('./rbac/initrbac');
var RBACMidware = require('./rbac/rbacmidware');

var auth = {};
auth.passport = passport;
auth.rbac = rbac;
auth.RBACMidware = RBACMidware;

module.exports = auth;