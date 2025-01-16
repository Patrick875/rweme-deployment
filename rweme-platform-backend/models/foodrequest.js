"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class FoodRequest extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Supplier, {
				foreignKey: {
					name: "supplierId",
					type: DataTypes.UUID,
				},
			});
			this.belongsTo(models.Farmer, {
				foreignKey: {
					name: "farmerId",
					type: DataTypes.UUID,
				},
			});

			this.belongsTo(models.User, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "submitedBy",
				},
				onDelete: "SET NULL",
			});
			this.belongsTo(models.TypeOfFeed, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "typeOfFeed",
				},
			});
		}
	}
	FoodRequest.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			farmerId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			quantityOfFeed: DataTypes.DECIMAL,
			typeOfFeed: DataTypes.UUID,
			price: DataTypes.DECIMAL,
			totalAmount: DataTypes.DECIMAL,
			issuedAt: DataTypes.DATE,
			paymentDueAt: DataTypes.DATE,
			supplierId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			receptionComfirmationCode: {
				type: DataTypes.BIGINT,
				allowNull: true,
			},
			deliveryStatus: DataTypes.ENUM("PENDING", "DELIVERED", "OVERDUE"),
			status: DataTypes.ENUM("IN-PROCESS", "PAID", "OVERDUE"),
			phoneUsedForPayment: DataTypes.STRING,
			submitedBy: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "foodrequests",
			modelName: "FoodRequest",
		}
	);
	return FoodRequest;
};
