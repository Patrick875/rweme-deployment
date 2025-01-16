"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Appointment extends Model {
		static associate(models) {
			this.belongsTo(models.Farmer, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "farmerId",
				},
			});
			this.belongsTo(models.Veternary, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "veternaryId",
				},
			});
			this.hasMany(models.AppointmentReschedure, {
				foreignKey: {
					name: "appointmentId",
					type: DataTypes.UUID,
				},
			});
		}
	}
	Appointment.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			farmerId: DataTypes.UUID,
			veternaryId: DataTypes.UUID,
			reschedules: {
				type: DataTypes.INTEGER,
				max: 3,
				defaultValue: 0,
			},
			status: {
				type: DataTypes.ENUM("PENDING", "DONE", "PAST_DUE"),
				defaultValue: "PENDING",
			},
			currentdate: DataTypes.DATE,
			dates: DataTypes.ARRAY(DataTypes.STRING),
		},
		{
			sequelize,
			tableName: "appointments",
			modelName: "Appointment",
		}
	);
	return Appointment;
};
