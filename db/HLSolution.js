module.exports = function(sequelize, DataTypes) {
	return sequelize.define("HLSolution", {
		gender: {
			type: DataTypes.STRING(4),
			primaryKey: true
		},
		age: {
			type: DataTypes.STRING(4),
			primaryKey: true
		},
		county: {
			type: DataTypes.STRING(16),
			primaryKey: true
		},
		living: {
			type: DataTypes.STRING(4),
			primaryKey: true
		},
		need: {
			type: DataTypes.STRING(4),
			primaryKey: true
		},
		risk: {
			type: DataTypes.STRING(4),
			primaryKey: true
		},
		solution: {
			type: DataTypes.STRING(4),
			primaryKey: true
		},
	    deg: DataTypes.STRING,
	    wDeg: DataTypes.STRING
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};