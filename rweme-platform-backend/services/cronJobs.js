const cron = require("node-cron-tz");
const { appointmentReminderFarmer } = require("./smsService");

function scheduleSMSForAppointment(appointmentDate, farmer, veternary) {
	const reminderTimes = [
		{ offset: 2, message: "Your appointment is in 2 days." },
		{ offset: 1, message: "Your appointment is tomorrow." },
	];

	reminderTimes.forEach(({ offset, message }) => {
		const reminderDate = new Date(appointmentDate);
		reminderDate.setDate(reminderDate.getDate() - offset);
		reminderDate.setHours(15, 0, 0, 0); // 5 PM GMT+2 is 15:00 in UTC

		if (reminderDate > new Date()) {
			cron.schedule(
				`${reminderDate.getUTCMinutes()} ${reminderDate.getUTCHours()} ${reminderDate.getUTCDate()} ${reminderDate.getUTCMonth() + 1} *`,
				() => {
					appointmentReminderFarmer(veternary, farmer, appointmentDate, false);
					// sendSMS(farmerPhone, `Farmer: ${message}`);
					// sendSMS(vetPhone, `Veterinary: ${message}`);
				},
				{ timezone: "Etc/GMT-2" }
			);
			console.log(`Scheduled reminder for ${reminderDate.toISOString()} - Message: ${message}`);
		}
	});
}

module.exports = {
	scheduleSMSForAppointment,
};
