
var Sequelize = require('sequelize');
var Config = require('../config');

var db = {};

db.Init = function(){
	db.sequelize = new Sequelize(Config.mysqlAuth.dbName, Config.mysqlAuth.username, Config.mysqlAuth.password,
		{host: Config.mysqlAuth.host, port: Config.mysqlAuth.port, logging: false});

	db.HLBasicInfo = db.sequelize.import(__dirname + "./../db/HLBasicInfo.js");
	db.HLNeed = db.sequelize.import(__dirname + "./../db/HLNeed.js");
	db.HLRisk = db.sequelize.import(__dirname + "./../db/HLRisk.js");
	db.HLSolution = db.sequelize.import(__dirname + "./../db/HLSolution.js");
	
	var syncOp = {};
	syncOp.force = false;
    db.sequelize.sync(syncOp);
}

module.exports = db;
