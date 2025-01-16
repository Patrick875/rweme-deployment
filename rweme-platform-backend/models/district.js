"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class District extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.sector, {
				foreignKey: {
					type: DataTypes.INTEGER,
					name: "districtId",
				},
			});
			this.belongsTo(models.Province, {
				foreignKey: {
					name: "provinceId",
					type: DataTypes.INTEGER,
				},
			});
		}
	}
	District.init(
		{
			name: DataTypes.STRING,
			provinceId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "District",
			tableName: "districts",
		}
	);
	return District;
};
