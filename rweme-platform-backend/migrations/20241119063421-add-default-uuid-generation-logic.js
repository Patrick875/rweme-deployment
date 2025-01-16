"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
      ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE farmstatuses ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE foodrequests ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE specializations ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE suppliers ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE typeofchickens ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE typeoffeeds ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE veternaries ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE veternaryspecializations ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE suppliertypeoffeeds ALTER COLUMN id SET DEFAULT gen_random_uuid();
      ALTER TABLE farmstatustypeoffeeds ALTER COLUMN id SET DEFAULT gen_random_uuid();
      
    `);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(`
      ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE farmstatuses ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE foodrequests ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE specializations ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE suppliers ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE typeofchickens ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE typeoffeeds ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE veternaries ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE veternaryspecializations ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE suppliertypeoffeeds ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE farmstatustypeoffeeds ALTER COLUMN id DROP DEFAULT;
      
    `);
	},
};
