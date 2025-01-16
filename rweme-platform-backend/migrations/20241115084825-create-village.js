"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("villages", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			cellId: {
				type: Sequelize.INTEGER,
				references: {
					model: "cells",
					key: "id",
				},
			},
			sectorId: {
				type: Sequelize.INTEGER,
				references: {
					model: "sectors",
					key: "id",
				},
			},
			districtId: {
				type: Sequelize.INTEGER,
				references: {
					model: "districts",
					key: "id",
				},
			},
			provinceId: {
				type: Sequelize.INTEGER,
				references: {
					model: "provinces",
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
		await queryInterface.dropTable("villages");
	},
};
