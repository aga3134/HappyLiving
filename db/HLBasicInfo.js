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
	    lang_Mandarin: DataTypes.INTEGER,
        lang_Taiwanese: DataTypes.INTEGER,
        lang_Hakka: DataTypes.INTEGER,
        liv_w_parents: DataTypes.INTEGER,
        liv_w_hw: DataTypes.INTEGER,
        liv_w_kid: DataTypes.INTEGER,
        liv_w_grandk: DataTypes.INTEGER,
        liv_w_others: DataTypes.INTEGER
	},
	{
		timestamps: false,
		freezeTableName: true
	});
};