"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			DROP TYPE "public"."enum_farmstatuses_chickenHealthCondition"
		CASCADE`);
		await queryInterface.sequelize.query(`
			CREATE TYPE "public"."enum_farmstatuses_chickenHealthCondition" AS ENUM('Healthy', 'Sick')
		`);
		await queryInterface.createTable("farmstatuses", {
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
			numberOfChicken: {
				type: Sequelize.INTEGER,
			},
			typeOfFeed: {
				type: Sequelize.UUID,
				references: {
					model: "typeoffeeds",
					key: "id",
				},
			},
			amountOfFeedOnDailyBasisPerChicken: {
				type: Sequelize.DECIMAL,
			},
			hasInsurance: {
				type: Sequelize.BOOLEAN,
			},
			chickenTypeId: {
				type: Sequelize.UUID,
				references: {
					model: "typeofchickens",
					key: "id",
				},
			},
			recordedOn: {
				type: Sequelize.DATE,
			},
			chickenHealthCondition: {
				type: Sequelize.ENUM("Healthy", "Sick"),
			},
			recordedBy: {
				type: Sequelize.UUID,
				references: {
					model: "veternaries",
				},
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
			DROP TYPE "public"."enum_farmstatuses_chickenHealthCondition"
		`);
		await queryInterface.dropTable("farmstatuses");
	},
};
