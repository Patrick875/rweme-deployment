"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Change the column type from INTEGER to STRING
		await queryInterface.changeColumn("farmers", "signupOTP", {
			type: Sequelize.STRING,
			allowNull: true, // Adjust based on whether the column should allow nulls
		});
	},

	down: async (queryInterface, Sequelize) => {
		// Revert the column type back to INTEGER
		await queryInterface.changeColumn("farmers", "signupOTP", {
			type: Sequelize.INTEGER,
			allowNull: true, // Adjust based on previous configuration
		});
	},
};
