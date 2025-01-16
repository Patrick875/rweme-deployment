"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert("typeofchickens", [
			{
				id: "f9a2d65f-6f1f-4248-8732-bc9b0e2e580e",
				name: "layer",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: "74738092-78e7-4c82-bcee-492deca142b4",
				name: "⁠broiler",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("typeofchickens", null, {});
	},
};
