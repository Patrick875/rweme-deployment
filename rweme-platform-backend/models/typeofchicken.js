"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class TypeOfChicken extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.FarmStatus, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "chickenTypeId",
				},
				onDelete: "SET NULL",
			});
		}
	}
	TypeOfChicken.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			name: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: "typeofchickens",
			modelName: "TypeOfChicken",
		}
	);
	return TypeOfChicken;
};
