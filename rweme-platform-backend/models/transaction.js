"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class transactions extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.FoodRequest, {
				foreignKey: {
					name: "foodRequestId",
					type: DataTypes.UUID,
				},
			});
			this.belongsTo(models.Farmer, {
				foreignKey: {
					name: "farmerId",
					type: DataTypes.UUID,
				},
			});
			this.belongsTo(models.Supplier, {
				foreignKey: {
					name: "supplierId",
					type: DataTypes.UUID,
				},
			});
		}
	}
	transactions.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			foodRequestId: DataTypes.UUID,
			transactionId: DataTypes.STRING,
			status: DataTypes.STRING,
			amount: DataTypes.FLOAT,
			farmerId: DataTypes.UUID,
			supplierId: DataTypes.UUID,
		},
		{
			sequelize,
			modelName: "Transaction",
			tableName: "transactions",
			timestamps: true,
		}
	);
	return transactions;
};
