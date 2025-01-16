"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			CREATE TYPE "public"."enum_foodrequests_status" AS ENUM('IN-PROCESS', 'PAID', 'OVERDUE')
		`);

		await queryInterface.createTable("foodrequests", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			farmerId: {
				type: Sequelize.UUID,
				references: {
					model: "farmers",
					key: "id",
				},
			},
			quantityOfFeed: {
				type: Sequelize.DECIMAL,
			},
			price: {
				type: Sequelize.DECIMAL,
			},
			totalAmount: {
				type: Sequelize.DECIMAL,
			},
			issuedAt: {
				type: Sequelize.DATE,
			},
			paymentDueAt: {
				type: Sequelize.DATE,
			},
			supplierId: {
				type: Sequelize.UUID,
				references: {
					model: "suppliers",
					key: "id",
				},
			},
			status: {
				type: Sequelize.ENUM("IN-PROCESS", "PAID", "OVERDUE"),
			},
			phoneUsedForPayment: {
				type: Sequelize.STRING,
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
		await queryInterface.sequelize.query(`
			DROP TYPE "public"."enum_foodrequests_status" AS ENUM('IN-PROCESS', 'PAID', 'OVERDUE')
		`);
		await queryInterface.dropTable("foodrequests");
	},
};
