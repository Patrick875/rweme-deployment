"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Cell extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.Village, {
				foreignKey: {
					name: "cellId",
					type: DataTypes.INTEGER,
				},
			});
			this.belongsTo(models.sector, {
				foreignKey: {
					name: "sectorId",
					type: DataTypes.INTEGER,
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
	Cell.init(
		{
			name: DataTypes.STRING,
			sectorId: DataTypes.INTEGER,
			districtId: DataTypes.INTEGER,
			provinceId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Cell",
			tableName: "cells",
		}
	);
	return Cell;
};
