"use strict";
const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class TypeOfFeed extends Model {
		static associate(models) {
			this.hasMany(models.FoodRequest, {
				foreignKey: {
					name: "typeOfFeed",
					type: DataTypes.UUID,
				},
				onDelete: "SET NULL",
			});
			this.belongsToMany(models.FarmStatus, {
				through: models.FarmStatusTypeOfFeed,
				as: "farmStatus",
				foreignKey: {
					name: "typeOfFeedId",
					type: DataTypes.UUID,
				},
				onDelete: "SET NULL",
				otherKey: "farmStatusId",
			});
		}
	}
	TypeOfFeed.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			name: DataTypes.STRING,
			createdAt: {
				type: DataTypes.DATE,
				defaultValue: Sequelize.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: Sequelize.NOW,
			},
		},
		{
			sequelize,
			tableName: "typeoffeeds",
			modelName: "TypeOfFeed",
		}
	);
	return TypeOfFeed;
};
