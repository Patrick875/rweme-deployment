"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("transactions", {
			id: {
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4,
				type: Sequelize.UUID,
			},
			transactionId: {
				type: Sequelize.STRING,
			},
			foodRequestId: {
				type: Sequelize.UUID,
				references: {
					model: "foodrequests",
					key: "id",
				},
			},
			status: {
				type: Sequelize.STRING,
			},
			amount: {
				type: Sequelize.FLOAT,
			},
			farmerId: {
				type: Sequelize.UUID,
				references: {
					model: "farmers",
					key: "id",
				},
			},
			supplierId: {
				type: Sequelize.UUID,
				references: {
					model: "suppliers",
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
		await queryInterface.dropTable("transactions");
	},
};
