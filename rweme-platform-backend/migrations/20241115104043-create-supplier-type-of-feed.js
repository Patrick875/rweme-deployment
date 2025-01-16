"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("suppliertypeoffeeds", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			supplierId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "suppliers",
					key: "id",
				},
			},
			typeOfFeedId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "typeoffeeds",
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
		await queryInterface.dropTable("suppliertypeoffeeds");
	},
};
