"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Sector extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.Cell, {
				foreignKey: {
					type: DataTypes.INTEGER,
					name: "sectorId",
				},
			});
			this.belongsTo(models.District, {
				foreignKey: {
					name: "districtId",
					type: DataTypes.INTEGER,
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
	Sector.init(
		{
			name: DataTypes.STRING,
			provinceId: DataTypes.INTEGER,
			districtId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "sector",
			tableName: "sectors",
		}
	);
	return Sector;
};
