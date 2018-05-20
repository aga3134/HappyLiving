var DB = require("./db");
var fs = require("fs");
var version = "1.0.1";

module.exports = function(app){
	var header = fs.readFileSync("./static/header.json");
	header = JSON.parse(header);

	DB.Init();

	app.get("/", function(req, res){
		res.render("static/index.ejs", {version: version});
	});

	app.get("/method", function(req, res){
		res.render("static/method.ejs", {version: version});
	});

	app.get("/opendata", function(req, res){
		res.render("static/opendata.ejs", {version: version});
	});

	app.get("/about", function(req, res){
		res.render("static/about.ejs", {version: version});
	});

	app.get("/analysis", function(req, res){
		res.render("static/analysis.ejs", {version: version});
	});

	function GetAgeArr(minAge,maxAge){
		var arr = [];
		for(var i=0;i<header.age.length;i++){
			var a = header.age[i];
			//console.log(a);
			if(a.minAge >= minAge && a.maxAge <= maxAge){
				arr.push(a.id);
			}
		}
		return arr;
	}

	app.get("/basicInfo", function(req, res){
		var gender = req.query.gender;
		var minAge = req.query.minAge;
		var maxAge = req.query.maxAge;
		var county = req.query.county;
		var living = req.query.living;
		var summary = req.query.summary;

		var query = {};
		if(gender) query.gender = gender;
		if(minAge && maxAge) query.age = GetAgeArr(minAge,maxAge);
		if(county) query.county = county;
		if(living) query.living = living;

		if(summary == 1){
			var groupArr = ['gender','age','county','living'];
			var attrArr = ['gender','age','county','living','weight',[DB.sequelize.fn('sum', DB.sequelize.col('num')),'num']];
			DB.HLBasicInfo.findAll({where: query, group: groupArr, attributes: attrArr})
			.then(function(results){
				res.send(JSON.stringify(results));
			});
		}
		else{
			DB.HLBasicInfo.findAll({where: query}).then(function(results){
				res.send(JSON.stringify(results));
			});
		}
	});

	app.get("/need", function(req, res){
		var gender = req.query.gender;
		var minAge = req.query.minAge;
		var maxAge = req.query.maxAge;
		var county = req.query.county;
		var living = req.query.living;
		var need = req.query.need;
		var summary = req.query.summary;

		var query = {};
		var groupArr = [];
		var attrArr = [];
		if(gender) query.gender = gender;
		if(minAge && maxAge) query.age = GetAgeArr(minAge,maxAge);
		if(county) query.county = county;
		if(living) query.living = living;
		if(need) query.need = need;

		if(summary == 1){
			var groupArr = ['need',];
			var attrArr = ['need',[DB.sequelize.fn('sum', DB.sequelize.col('num')),'num'],
							[DB.sequelize.fn('sum', DB.sequelize.col('wNum')),'wNum']];
			DB.HLNeed.findAll({where: query, group: groupArr, attributes: attrArr})
			.then(function(results){
				res.send(JSON.stringify(results));
			});
		}
		else{
			DB.HLNeed.findAll({where: query}).then(function(results){
				res.send(JSON.stringify(results));
			});
		}

	});

	app.get("/risk", function(req, res){
		var gender = req.query.gender;
		var minAge = req.query.minAge;
		var maxAge = req.query.maxAge;
		var county = req.query.county;
		var living = req.query.living;
		var need = req.query.need;
		var risk = req.query.risk;
		var summary = req.query.summary;

		var query = {};
		var groupArr = [];
		var attrArr = [];
		if(gender) query.gender = gender;
		if(minAge && maxAge) query.age = GetAgeArr(minAge,maxAge);
		if(county) query.county = county;
		if(living) query.living = living;
		if(need) query.need = need;
		if(risk) query.risk = risk;

		if(summary == 1){
			var groupArr = ['need','risk'];
			var attrArr = ['need','risk',[DB.sequelize.fn('sum', DB.sequelize.col('num')),'num'],
							[DB.sequelize.fn('sum', DB.sequelize.col('wNum')),'wNum']];
			DB.HLRisk.findAll({where: query, group: groupArr, attributes: attrArr})
			.then(function(results){
				res.send(JSON.stringify(results));
			});
		}
		else{
			DB.HLRisk.findAll({where: query}).then(function(results){
				res.send(JSON.stringify(results));
			});
		}
	});

	app.get("/solution", function(req, res){
		var gender = req.query.gender;
		var minAge = req.query.minAge;
		var maxAge = req.query.maxAge;
		var county = req.query.county;
		var living = req.query.living;
		var need = req.query.need;
		var risk = req.query.risk;
		var solution = req.query.solution;
		var summary = req.query.summary;

		var query = {};
		var groupArr = [];
		var attrArr = [];
		if(gender) query.gender = gender;
		if(minAge && maxAge) query.age = GetAgeArr(minAge,maxAge);
		if(county) query.county = county;
		if(living) query.living = living;
		if(need) query.need = need;
		if(risk) query.risk = risk;
		if(solution) query.solution = solution;

		if(summary == 1){
			var groupArr = ['need','risk','solution'];
			var attrArr = ['need','risk','solution',
							[DB.sequelize.fn('sum', DB.sequelize.col('deg1')),'deg1'],
							[DB.sequelize.fn('sum', DB.sequelize.col('deg2')),'deg2'],
							[DB.sequelize.fn('sum', DB.sequelize.col('deg3')),'deg3'],
							[DB.sequelize.fn('sum', DB.sequelize.col('deg4')),'deg4'],
							[DB.sequelize.fn('sum', DB.sequelize.col('deg5')),'deg5'],
							[DB.sequelize.fn('sum', DB.sequelize.col('wDeg1')),'wDeg1'],
							[DB.sequelize.fn('sum', DB.sequelize.col('wDeg2')),'wDeg2'],
							[DB.sequelize.fn('sum', DB.sequelize.col('wDeg3')),'wDeg3'],
							[DB.sequelize.fn('sum', DB.sequelize.col('wDeg4')),'wDeg4'],
							[DB.sequelize.fn('sum', DB.sequelize.col('wDeg5')),'wDeg5']];
			DB.HLSolution.findAll({where: query, group: groupArr, attributes: attrArr})
			.then(function(results){
				res.send(JSON.stringify(results));
			});
		}
		else{
			DB.HLSolution.findAll({where: query}).then(function(results){
				res.send(JSON.stringify(results));
			});
		}
	});


}