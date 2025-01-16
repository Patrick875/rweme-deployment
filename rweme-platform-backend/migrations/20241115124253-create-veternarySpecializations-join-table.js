"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("veternaryspecializations", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			specializationId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "specializations",
					key: "id",
				},
			},
			veternaryId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "veternaries",
					key: "id",
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
		await queryInterface.dropTable("veternaryspecializations");
	},
};
