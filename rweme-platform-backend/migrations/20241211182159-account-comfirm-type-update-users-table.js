"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn("users", "account_comfirm_code", {
			type: Sequelize.BIGINT,
			allowNull: true,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn("users", "account_comfirm_code", {
			type: Sequelize.INTEGER,
			allowNull: true,
		});
	},
};
