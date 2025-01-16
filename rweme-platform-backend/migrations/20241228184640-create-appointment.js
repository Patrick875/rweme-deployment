"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			CREATE TYPE "public"."enum_appointments_status" AS ENUM('PENDING', 'DONE', 'PAST_DUE')
		`);
		await queryInterface.createTable("appointments", {
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
					onDelete: "SET NULL",
				},
			},
			veternaryId: {
				type: Sequelize.UUID,
				references: {
					model: "veternaries",
					key: "id",
					onDelete: "SET NULL",
				},
			},
			type: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.ENUM("PENDING", "DONE", "PAST_DUE"),
			},
			reschedules: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				max: 3,
			},
			currentdate: {
				type: Sequelize.DATE,
			},
			dates: {
				type: Sequelize.ARRAY(Sequelize.STRING),
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
			DROP TYPE "public"."enum_appointments_status" AS ENUM('PENDING', 'DONE', 'PAST_DUE')
		`);
		await queryInterface.dropTable("appointments");
	},
};
