"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Remove the existing foreign key constraint
		await queryInterface.removeConstraint("farmers", "farmers_addressId_fkey");
		await queryInterface.removeConstraint("users", "users_addressId_fkey");
		// Update the reference in the addressId column to point to villages
		await queryInterface.changeColumn("farmers", "addressId", {
			type: Sequelize.INTEGER,
			references: {
				model: "villages", // New table reference
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});
		await queryInterface.changeColumn("users", "addressId", {
			type: Sequelize.INTEGER,
			references: {
				model: "villages",
				key: "id",
			},
		});
	},

	async down(queryInterface, Sequelize) {
		// Revert the reference in the addressId column to point back to cells
		await queryInterface.changeColumn("farmers", "addressId", {
			type: Sequelize.INTEGER,
			references: {
				model: "cells", // Old table reference
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});

		// Add the foreign key constraint back
		await queryInterface.addConstraint("farmers", {
			fields: ["addressId"],
			type: "foreign key",
			name: "farmers_addressId_cells_fk", // Name of the foreign key
			references: {
				table: "cells",
				field: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});

		await queryInterface.changeColumn("users", {
			type: Sequelize.INTEGER,
			references: {
				model: "cells", // New table reference
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});

		await queryInterface.addConstraint("users", {
			fields: ["addressId"],
			type: "foreign key",
			name: "users_addressId_fkey", // Name of the foreign key
			references: {
				table: "cells",
				field: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});
	},
};
