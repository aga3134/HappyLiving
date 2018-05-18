module.exports = function(sequelize, DataTypes) {
	return sequelize.define("HLNeed", {
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
	    num: DataTypes.INTEGER,
	    wNum: DataTypes.FLOAT
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};