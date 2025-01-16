"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("farmers", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			fullName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
			},
			telephone: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			nationalId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			signupOTP: {
				type: Sequelize.INTEGER,
			},
			addressId: {
				type: Sequelize.INTEGER,
				references: {
					model: "cells",
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
		await queryInterface.dropTable("farmers");
	},
};
