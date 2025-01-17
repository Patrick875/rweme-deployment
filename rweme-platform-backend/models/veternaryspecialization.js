"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class VeternarySpecialization extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	VeternarySpecialization.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			specializationId: DataTypes.UUID,
			veternaryId: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "veternaryspecializations",
			modelName: "VeternarySpecialization",
		}
	);
	return VeternarySpecialization;
};
