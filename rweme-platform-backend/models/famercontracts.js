"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class FarmerContract extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.Farmer, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "farmerId",
				},
			});
		}
	}
	FarmerContract.init(
		{
			farmerId: DataTypes.UUID,
			contractLink: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "FarmerContract",
			tableName: "farmercontracts",
		}
	);
	return FarmerContract;
};
