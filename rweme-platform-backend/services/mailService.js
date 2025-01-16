const nodemailer = require("nodemailer");
const ejs = require("ejs");
const transporter = nodemailer.createTransport({
	port: 465,
	host: "smtp.gmail.com",
	auth: {
		user: process.env.SYSTEM_EMAIL,
		pass: process.env.SYSTEM_EMAIL_PASSWORD,
	},
});

const sendEmail = (to, subject, template, templateData) => {
	ejs.renderFile(template, templateData, async (err, html) => {
		if (err) {
			return console.log("error rendering ejs template", err);
		}
		await transporter.sendMail(
			{
				from: process.env.SYSTEM_EMAIL,
				to,
				subject,
				html,
			},
			(error, info) => {
				if (error) {
					return console.log(error);
				}
			}
		);
	});
};
module.exports = { sendEmail };
