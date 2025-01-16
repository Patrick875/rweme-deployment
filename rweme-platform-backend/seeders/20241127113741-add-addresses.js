"use strict";
const data = require("../optimized_results.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		let provinces = data.provinces;
		let districts = data.districts;
		let sectors = data.sectors;
		let cells = data.cells;
		let villages = data.villages;

		await queryInterface.bulkInsert("provinces", provinces);
		await queryInterface.bulkInsert("districts", districts);
		await queryInterface.bulkInsert("sectors", sectors);
		await queryInterface.bulkInsert("cells", cells);
		await queryInterface.bulkInsert("villages", villages);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("provinces", null, {});
		await queryInterface.bulkDelete("districts", null, {});
		await queryInterface.bulkDelete("sectors", null, {});
		await queryInterface.bulkDelete("cells", null, {});
		await queryInterface.bulkDelete("villages", null, {});
	},
};
