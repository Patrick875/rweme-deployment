"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Supplier extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.User, {
				foreignKey: {
					name: "userId",
					type: DataTypes.UUID,
				},
			});
			this.belongsToMany(models.TypeOfFeed, {
				through: models.SupplierTypeOfFeed,
				as: "TypeOfFeed",
				foreignKey: {
					type: DataTypes.UUID,
					name: "supplierId",
				},
				otherKey: "typeOfFeedId",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
			this.hasMany(models.FoodRequest, {
				foreignKey: {
					name: "supplierId",
					type: DataTypes.UUID,
				},
			});
			this.hasMany(models.Transaction, {
				foreignKey: {
					name: "supplierId",
					type: DataTypes.UUID,
				},
			});
		}
	}
	Supplier.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			momoPay: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			tableName: "suppliers",
			modelName: "Supplier",
		}
	);
	return Supplier;
};
