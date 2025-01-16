"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class AppointmentReschedure extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Appointment, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "appointmentId",
				},
			});
			this.belongsTo(models.Veternary, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "doneBy",
				},
			});
		}
	}
	AppointmentReschedure.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			oldDate: DataTypes.DATE,
			newDate: DataTypes.DATE,
			comment: DataTypes.STRING,
			appointmentId: DataTypes.UUID,
			doneBy: DataTypes.UUID,
			doneAt: DataTypes.DATE,
		},
		{
			sequelize,
			timestamps: true,
			modelName: "AppointmentReschedure",
			tableName: "appointmentreschedures",
		}
	);
	return AppointmentReschedure;
};
