"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			CREATE TYPE "public"."enum_users_status" AS ENUM('Pending', 'Active', 'Inactive', 'Blocked', 'Deleted')
		`);
		await queryInterface.sequelize.query(`
			CREATE TYPE "public"."enum_users_role" AS ENUM('Admin', 'Veternary', 'Supplier')
		`);
		await queryInterface.createTable("users", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			fullName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			telephone: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			nationalId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			addressId: {
				type: Sequelize.INTEGER,
				references: {
					model: "villages",
					key: "id",
				},
			},
			password: {
				type: Sequelize.STRING,
			},
			entryRetries: {
				type: Sequelize.INTEGER,
			},
			account_comfirm_code: {
				type: Sequelize.INTEGER,
			},
			status: {
				type: Sequelize.ENUM("Pending", "Active", "Inactive", "Blocked", "Deleted"),
			},
			role: {
				type: Sequelize.ENUM("Admin", "Veternary", "Supplier"),
			},
			account_reset_code: {
				type: Sequelize.STRING,
			},
			lastLogin: {
				type: Sequelize.DATE,
			},
			accountBlockedAt: {
				type: Sequelize.DATE,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("users");
		await queryInterface.sequelize.query(`
			DROP TYPE "public"."enum_users_status"
		`);
		await queryInterface.sequelize.query(`
			DROP TYPE "public"."enum_users_role"
		`);
	},
};
