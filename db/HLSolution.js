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
	    deg1: DataTypes.INTEGER,
        deg2: DataTypes.INTEGER,
        deg3: DataTypes.INTEGER,
        deg4: DataTypes.INTEGER,
        deg5: DataTypes.INTEGER,
        wDeg1: DataTypes.INTEGER,
        wDeg2: DataTypes.INTEGER,
        wDeg3: DataTypes.INTEGER,
        wDeg4: DataTypes.INTEGER,
        wDeg5: DataTypes.INTEGER
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};