"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeConstraint("farmstatuses", "farmstatuses_recordedBy_fkey");
		await queryInterface.changeColumn("farmstatuses", "recordedBy", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"farmstatuses",
			"farmstatuses_recordedBy_fkey" // Adjust this to the actual name of the constraint if different
		);

		await queryInterface.changeColumn("farmstatuses", "recordedBy", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "veternaries",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});
	},
};
