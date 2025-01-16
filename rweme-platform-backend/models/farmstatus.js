"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class FarmStatus extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Farmer, {
				foreignKey: { name: "farmerId", type: DataTypes.UUID },
			});
			this.belongsTo(models.User, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "recordedBy",
				},
				as: "collectedBy",
				onDelete: "SET NULL",
			});
			this.belongsTo(models.TypeOfChicken, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "chickenTypeId",
				},
				onDelete: "SET NULL",
			});
			this.belongsToMany(models.TypeOfFeed, {
				through: models.FarmStatusTypeOfFeed,
				as: "typeofFeeds",
				foreignKey: {
					name: "farmStatusId",
					type: DataTypes.UUID,
				},
				otherKey: "typeOfFeedId",
				onDelete: "SET NULL",
			});
		}
	}
	FarmStatus.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			farmerId: DataTypes.UUID,
			numberOfChicken: DataTypes.INTEGER,
			typeOfFeed: DataTypes.UUID,
			amountOfFeedOnDailyBasisPerChicken: DataTypes.DECIMAL,
			amountOfFeedToBeDelivered: DataTypes.DECIMAL,
			priceOfFeedToBeDelivered: DataTypes.DECIMAL,
			totalAmountToBePaid: DataTypes.DECIMAL,
			hasInsurance: DataTypes.BOOLEAN,
			chickenTypeId: DataTypes.UUID,
			chickenHealth: DataTypes.ENUM("Healthy", "Sick"),
			// chickenHealthCondition: DataTypes.ENUM("Healthy", "Sick"),
			recordedOn: DataTypes.DATE,
			recordedBy: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "farmstatuses",
			modelName: "FarmStatus",
		}
	);
	return FarmStatus;
};
