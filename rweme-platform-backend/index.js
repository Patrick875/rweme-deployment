const dotenv = require("dotenv");
const app = require("./app.js");
const { sequelize } = require("./models");
dotenv.config({
	path: "./.env",
});

const PORT = process.env.DEV_PORT;

app.listen(PORT, () => {
	console.log(`app running on port ${PORT}`);
	sequelize.sync().then(() => {
		console.log(`DB connected successfully !!!`);
	});
});
