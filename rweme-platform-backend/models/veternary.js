"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Veternary extends Model {
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
				onDelete: "SET NULL",
			});

			this.belongsToMany(models.Specialization, {
				through: models.VeternarySpecialization,
				as: "specializations",
				foreignKey: {
					name: "veternaryId",
					type: DataTypes.UUID,
				},
				otherKey: "specializationId",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
			this.hasMany(models.Farmer, {
				foreignKey: {
					name: "assignedTo",
					type: DataTypes.UUID,
				},
			});
			this.hasMany(models.Appointment, {
				foreignKey: {
					name: "veternaryId",
					type: DataTypes.UUID,
				},
			});
			this.hasMany(models.AppointmentReschedure, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "doneBy",
				},
			});
		}
	}
	Veternary.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			userId: DataTypes.UUID,
			specializationId: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "veternaries",
			modelName: "Veternary",
		}
	);
	return Veternary;
};
