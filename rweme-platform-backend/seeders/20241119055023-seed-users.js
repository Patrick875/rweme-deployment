"use strict";
const { hashPassword } = require("../utils/passwordAndOTP");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("users", [
			{
				id: "550e8400-e29b-41d4-a716-446655440000",
				fullName: "Admin",
				email: "rweme@gmail.com",
				telephone: "0788284554",
				nationalId: "1200000000000000",
				password: await hashPassword(process.env.ADMIN_PASSWORD),
				status: "Active",
				role: "Admin",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("users", {
			email: "rweme@gmail.com",
		});
	},
};
