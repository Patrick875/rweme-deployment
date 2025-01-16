const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "Rweme Platform API",
		version: "1.0.0",
		description: "Rweme chicken farm platform api",
	},
};
const options = {
	swaggerDefinition,
	apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
