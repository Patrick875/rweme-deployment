"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Specialization extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsToMany(models.Veternary, {
				through: models.VeternarySpecialization,
				as: "Veternaries",
				foreignKey: {
					name: "veternaryId",
					type: DataTypes.UUID,
				},
				otherKey: "veternaryId",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
		}
	}
	Specialization.init(
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
			tableName: "specializations",
			modelName: "Specialization",
		}
	);
	return Specialization;
};
