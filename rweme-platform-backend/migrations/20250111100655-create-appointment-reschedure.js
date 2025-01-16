"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("appointmentreschedures", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			oldDate: {
				type: Sequelize.DATE,
			},
			newDate: {
				type: Sequelize.DATE,
			},
			comment: {
				type: Sequelize.STRING,
			},
			appointmentId: {
				type: Sequelize.UUID,
			},
			doneBy: {
				type: Sequelize.UUID,
				references: {
					model: "veternaries",
					key: "id",
				},
			},
			doneAt: {
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
		await queryInterface.dropTable("appointmentreschedures");
	},
};
