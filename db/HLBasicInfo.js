module.exports = function(sequelize, DataTypes) {
	return sequelize.define("HLBasicInfo", {
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
	    num: DataTypes.INTEGER,
	    weight: DataTypes.FLOAT,
	    lang: DataTypes.STRING,
	    livewith: DataTypes.STRING
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};