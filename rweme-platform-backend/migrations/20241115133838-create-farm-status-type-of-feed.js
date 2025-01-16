"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("farmstatustypeoffeeds", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			farmStatusId: {
				type: Sequelize.UUID,
				references: {
					model: "farmstatuses",
					key: "id",
				},
			},
			typeOfFeedId: {
				type: Sequelize.UUID,
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
		await queryInterface.dropTable("farmstatustypeoffeeds");
	},
};
