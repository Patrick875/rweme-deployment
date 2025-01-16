const dotenv = require("dotenv");

dotenv.config({
	path: "./.env",
});

const dbConfig = {
	development: {
		username: "postgres",
		password: "12345",
		database: process.env.database_development,
		host: "127.0.0.1",
		dialect: "postgres",
		logger: false,
		logging: false,
	},
	production: {
		username: "neondb_owner",
		database: process.env.database_prod,
		password: process.env.prod_password,
		host: process.env.prod_host,
		dialect: "postgres",
		dialectOptions: {
			ssl: {
				require: true,
				// rejectUnauthorized: false, // Optional
			},
		},
		logger: false,
		logging: false,
	},
};

module.exports = dbConfig;
