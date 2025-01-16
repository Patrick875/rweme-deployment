"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			CREATE TYPE "public"."enum_farmers_status" AS ENUM('Pending', 'Active', 'Inactive', 'Blocked', 'Deleted')
		`);
		await queryInterface.addColumn("farmers", "status", {
			type: Sequelize.ENUM("Pending", "Active", "Inactive", "Blocked", "Deleted"),
			defaultValue: "Active",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
			DROP TYPE "public"."enum_farmers_status"
		`);
		await queryInterface.removeColumn("farmers", "status");
	},
};
