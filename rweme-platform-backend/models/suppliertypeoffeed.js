"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class SupplierTypeOfFeed extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	SupplierTypeOfFeed.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			supplierId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			typeOfFeedId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "suppliertypeoffeeds",
			modelName: "SupplierTypeOfFeed",
		}
	);
	return SupplierTypeOfFeed;
};
