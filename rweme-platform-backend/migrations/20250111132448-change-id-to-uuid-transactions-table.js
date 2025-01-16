"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		// Step 1: Create a new UUID column temporarily
		await queryInterface.addColumn("transactions", "newId", {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4, // Automatically generate UUID values
			allowNull: false,
		});

		// Step 2: Copy data from old `id` column to `newId`
		await queryInterface.sequelize.query(`
      UPDATE "transactions"
      SET "newId" = gen_random_uuid()
    `);

		// Step 3: Remove the old `id` column
		await queryInterface.removeColumn("transactions", "id");

		// Step 4: Rename `newId` to `id`
		await queryInterface.renameColumn("transactions", "newId", "id");

		// Step 5: Set `id` as the primary key (if needed)
		await queryInterface.changeColumn("transactions", "id", {
			type: Sequelize.UUID,
			allowNull: false,
			primaryKey: true,
		});
	},

	async down(queryInterface, Sequelize) {
		// Rollback steps to revert UUID back to INTEGER
		await queryInterface.addColumn("transactions", "oldId", {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
		});

		// Remove UUID column and revert primary key
		await queryInterface.removeColumn("transactions", "id");
		await queryInterface.renameColumn("transactions", "oldId", "id");
	},
};
