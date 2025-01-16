"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Farmer extends Model {
		static associate(models) {
			this.belongsTo(models.Village, {
				foreignKey: "addressId",
			});
			this.hasMany(models.FarmStatus, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "farmerId",
				},
			});
			this.hasMany(models.FoodRequest, {
				foreignKey: {
					name: "farmerId",
					type: DataTypes.UUID,
				},
			});
			this.hasMany(models.Transaction, {
				foreignKey: {
					name: "farmerId",
					type: DataTypes.UUID,
				},
			});
			this.hasMany(models.FarmerContract, {
				foreignKey: {
					name: "farmerId",
					type: DataTypes.UUID,
				},
			});
			this.belongsTo(models.Veternary, {
				foreignKey: {
					name: "assignedTo",
					type: DataTypes.UUID,
				},
			});
			this.hasMany(models.Appointment, {
				foreignKey: {
					name: "farmerId",
					type: DataTypes.UUID,
				},
			});
		}
	}
	Farmer.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			fullName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
			},
			telephone: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					is: /^07/,
				},
			},
			nationalId: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					is: /^(1|2)\d{15}$/,
				},
			},
			isContractSigned: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			typeOfChicken: DataTypes.STRING,
			numberOfChicken: DataTypes.INTEGER,
			hasInsurance: DataTypes.BOOLEAN,
			typeOfFeed: DataTypes.STRING,
			veternaryInCharge: DataTypes.STRING,
			status: {
				type: DataTypes.ENUM("Pending", "Active", "Inactive", "Blocked", "Deleted"),
				defaultValue: "Active",
			},
			nextOfKin: {
				type: DataTypes.JSONB,
				validate: {
					isValidObject(value) {
						if (typeof value !== "object" || Array.isArray(value)) {
							throw new Error("objectData must be a plain object");
						}
						if (!value.hasOwnProperty("fullName") || typeof value.fullName !== "string") {
							throw new Error('objectData must have a "fullName" property of type string');
						}
						if (!value.hasOwnProperty("nationalId") || typeof value.nationalId !== "string") {
							throw new Error('objectData must have a "nationalId" property of type string');
						}
					},
				},
			},
			contractLink: DataTypes.STRING,
			addressId: DataTypes.INTEGER,
			signupOTP: DataTypes.STRING,
			assignedTo: DataTypes.UUID,
			signupOTPExpiresAt: DataTypes.BIGINT,
		},
		{
			sequelize,
			tableName: "farmers",
			modelName: "Farmer",
			defaultScope: {
				attributes: { exclude: ["signupOTP"] },
			},
			scopes: {
				auth: {
					attributes: { include: ["signupOTP"] },
				},
			},
		}
	);
	return Farmer;
};
