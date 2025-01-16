const axios = require("axios");

const sendSMS = async (to, text, sender = "PindoTest") => {
	try {
		await axios.post(
			"https://api.pindo.io/v1/sms/",
			{ to, text, sender },
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.PINDO_TOKEN}`,
				},
			}
		);
		console.log(`SMS sent to ${to}: ${text}`);
	} catch (err) {
		console.error(`Failed to send SMS to ${to}:`, err.message);
	}
};
const sendFarmerConfirmationOTP = async (username, telephone, otp) => {
	const message = `Mwiriwe ${username},
    \nMurakoze kwiyandikisha kuri RWEME platform, umubare banga wanyu ni ${otp}\nMurakoze.`;
	await sendSMS(`+25${telephone}`, message);
};

const newFoodRequestNotification = async (username, telephone) => {
	const message = `Mwiriwe ${username},
    \nMuhawe order y'ibiryo kuri Rweme platform.\nKu bindi bisobanuro injira kuri rubuga rwacu.\nIrengagize ubu butumwa niba udasanzwe ukorana na RWEME Platform.`;

	await sendSMS(`+25${telephone}`, message);
};
const sendComfirmFoodReceptionSMS = async (farmerName, supplierName, telephone, comfirmationCode) => {
	const message = `Mwiriwe ${farmerName},
    \nUmubare banga wo kwemeza ko muhawe ibiryo by' amatungo na ${supplierName} ni ${comfirmationCode}.\nKu bindi bisobanuro injira kuri rubuga rwacu.\nIrengagize ubu butumwa niba udasanzwe ukorana na RWEME Platform.`;
	await sendSMS(`+25${telephone}`, message);
};

const appointmentReminderVeternary = async (veternary, farmer, appointmentDate, isSecondNot) => {
	const message = `Mwiriwe ${veternary.User.fullName},
	\nTurabibutsa ko mufite gahunda yo gusura umworozi w ' inkoko witwa ${farmer.fullName}, uherereye mu karere ka ${farmer.User.Village.District.name}
	\nUmurenge wa ${farmer.User.Village.sector.name}, akagari ka ${farmer.Village.Cell.nane}, umudugudu wa ${farmer.Village.name}.
	\nNimero z uyu mworozi ni ${farmer.telephone}.
	\nIyi gahunda iteganyijwe ${isSecondNot ? "Ejo tariki ya " + { appointmentDate } : "Ejo bundi tariki ya " + +{ appointmentDate }}
	\n\nRWEME Platform`;
	await sendSMS(veternary.User.telephone, message);
};
const appointmentReminderFarmer = async (veternary, farmer, appointmentDate, isSecondNot) => {
	const message = `Mwiriwe ${farmer.fullName},
	\nTurabibutsa ko mufite gahunda yo gusurwa na veternaire  ${veternary.User.fullName}.
	\n Nimero y uzagusura ni ${veternary.User.telephone}.
	\n Iyi gahunda iteganyijwe ${isSecondNot ? "Ejo tariki ya " + { appointmentDate } : "Ejo bundi tariki ya " + +{ appointmentDate }}
	\n\nRWEME Platform`;
	await sendSMS(farmer.telephone, message);
};

module.exports = {
	sendFarmerConfirmationOTP,
	newFoodRequestNotification,
	sendComfirmFoodReceptionSMS,
	appointmentReminderFarmer,
	appointmentReminderVeternary,
};
