"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Village, {
				foreignKey: "addressId", // Explicitly define the foreign key name
				onDelete: "SET NULL",
			});
			this.hasOne(models.Veternary, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "userId",
				},
			});
			this.hasOne(models.Supplier, {
				foreignKey: {
					type: DataTypes.UUID,
					name: "userId",
				},
			});
			this.hasMany(models.FoodRequest, {
				foreignKey: {
					name: "submitedBy",
					type: DataTypes.UUID,
				},
			});
		}
	}
	User.init(
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
				allowNull: false,
				unique: true,
			},
			addressId: {
				type: DataTypes.INTEGER,
				allowNull: true,
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
			password: DataTypes.STRING,
			entryRetries: DataTypes.INTEGER,
			account_comfirm_code: DataTypes.BIGINT,
			status: DataTypes.ENUM("Pending", "Active", "Inactive", "Blocked", "Deleted"),
			role: DataTypes.ENUM("Admin", "Veternary", "Supplier"),
			account_reset_code: DataTypes.STRING,
			lastLogin: DataTypes.DATE,
			accountBlockedAt: DataTypes.DATE,
			resetPasswordToken: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: "users",
			modelName: "User",
			defaultScope: {
				attributes: { exclude: ["password"] },
			},
			scopes: {
				auth: {
					attributes: { include: ["password"] },
				},
				active: {
					where: {
						status: {
							[Op.ne]: "Deleted",
						},
					},
				},
			},
		}
	);
	return User;
};
