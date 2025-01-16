const { Appointment, AppointmentReschedure, Farmer, Veternary, User, Village, Cell, sector, District } = require("./../models");
const { Op } = require("sequelize");
const locationInclude = [{ model: Village, include: [{ model: District }, { model: Cell }, { model: sector }] }];
const create = async (req, res) => {
	const { farmerId, veternaryId, date } = req.body;
	if (!farmerId || !veternaryId || !date) {
		return res.status(400).json({
			status: "Failed",
			message: "Missing data. FarmerId, veternaryId, type and date are all required ",
		});
	}
	const created = await Appointment.create({
		farmerId,
		veternaryId,
		status: "PENDING",
		currentDate: new Date(date).toISOString,
		dates: [new Date(date).toLocaleDateString("fr-FR")],
	});
	return res.status(201).json({
		status: "Success",
		data: created,
		message: "Appointment successfuly created",
	});
};

const getAllAppointments = async (req, res) => {
	// const searchQuery = req.query.q;
	const appointments = await Appointment.findAll({
		// where: {
		// 	[Op.or]: [
		// 		{ "$Farmer.fullName$": { [Op.iLike]: `%${searchQuery}%` } },
		// 		{ "$Veternary.User.fullName$": { [Op.iLike]: `%${searchQuery}%` } },
		// 		{ currentDate: { [Op.iLike]: `%${searchQuery}%` } },
		// 	],
		// },
		include: [{ model: Farmer }, { model: Veternary, include: [{ model: User }] }, { model: AppointmentReschedure }],
	});
	return res.status(200).json({
		status: "Success",
		data: appointments,
		length: appointments.length,
	});
};
const getAllAppointmentsByVet = async (req, res) => {
	const { veternaryId } = req.params;
	const appointments = await Appointment.findAll({
		where: {
			veternaryId,
		},
		include: [{ model: Farmer }, { model: AppointmentReschedure }],
	});
	return res.status(200).json({
		status: "Success",
		data: appointments,
		dataLength: appointments.length,
	});
};
const getAllAppointmentsByFarmer = async (req, res) => {
	const { farmerId } = req.params;
	const appointments = await Appointment.findAll({
		where: {
			farmerId,
		},
		include: [{ model: Veternary, include: [{ model: User }] }, { model: AppointmentReschedure }],
	});
	return res.status(200).json({
		status: "Success",
		data: appointments,
		dataLength: appointments.length,
	});
};

const getSingleAppointment = async (req, res) => {
	const { id } = req.params;
	const appoint = await Appointment.findOne({
		where: {
			id,
		},
		include: [
			{ model: Farmer },
			{
				model: AppointmentReschedure,
				include: [
					{
						model: Veternary,
						include: [
							{
								model: User,
							},
						],
					},
				],
			},
		],
	});
	return res.status(200).json({
		status: "success",
		data: appoint,
		message: "Appointment fetched successfuly",
	});
};
const updateAppointment = async (req, res) => {
	const { id } = req.params;
	const { farmerId, veternaryId, currentDate } = req.body;
	const appoint = await Appointment.findByPk(id);
	if (!appoint) {
		return res.status(404).json({
			status: "Not Found",
			message: "Appointment with id not found",
		});
	}
	const updated = await Appointment.update({
		farmerId,
		veternaryId,
		currentDate: appoint.toJSON().reschedules < 3 ? new Date(currentDate).toISOString() : appoint.toJSON().currentDate,
		reschedules: currentDate && appoint.toJSON().reschedules < 3 ? appoint.toJSON().reschedules + 1 : appoint.toJSON().reschedules,
		dates:
			currentDate && appoint.toJSON().reschedules < 3
				? [...appoint.toJSON().dates, new Date(currentDate).toLocaleDateString("fr-FR")]
				: appoint.toJSON().dates,
	});
	return res.status(203).json({
		status: "Success",
		data: updated,
		message: "Appointment updated successfully!!!",
	});
};
const reschedureAppointment = async (req, res) => {
	const { id } = req.params;
	const { date, comment } = req.body;
	const appoint = await Appointment.findByPk(id);
	if (!date) {
		return res.status(400).json({
			status: "Missing Data",
			message: "Reschedule date is required",
		});
	}
	if (!appoint) {
		return res.status(404).json({
			status: "Not Found",
			message: "Appointment with id not found",
		});
	}
	if (appoint.toJSON().reschedules == 3) {
		return res.status(400).json({
			status: "Action failed",
			message: "Appointment can not be rescheduled more than 3 times",
		});
	}

	await AppointmentReschedure.create({
		appointmentId: id,
		oldDate: appoint.toJSON().currentDate,
		newDate: new Date(date).toISOString(),
		comment,
		doneBy: req.uservetId ? req.uservetId : req.userId,
		doneAt: new Date().toISOString(),
	});
	// await AppointmentReschedure.create({
	// 	appointmentId: id,
	// 	oldDate: appoint.toJSON().currentDate,
	// 	newDate: new Date(date).toISOString(),
	// 	comment,
	// 	doneBy: req.uservetId,
	// 	doneAt: new Date().toISOString(),
	// });
	const updated = await Appointment.update(
		{
			currentDate: new Date(date).toISOString(),
			reschedules: appoint.toJSON().reschedules + 1,
			dates: [...appoint.toJSON().dates, new Date(date).toLocaleDateString("fr-FR")],
		},
		{
			where: {
				id,
			},
		}
	);
	return res.status(203).json({
		status: "Success",
		data: updated,
		message: "Appointment reschuled successfully!!!",
	});
};
const deleteAppointment = async (req, res) => {
	const { id } = req.params;
	const appoint = await Appointment.findByPk(id);
	if (!appoint) {
		return res.status(404).json({
			status: "Error",
			message: "appointment not found",
		});
	}
	await Appointment.destroy({
		where: {
			id,
		},
	});
	return res.status(204).json({
		status: "Succcess",
		message: "Deleted",
	});
};
const deleteAllAppointments = async (req, res) => {
	await Appointment.destroy({ truncate: true });
	return res.status(204).json({
		status: "Succcess",
		message: "Deleted",
	});
};

module.exports = {
	create,
	getAllAppointments,
	getAllAppointmentsByVet,
	getAllAppointmentsByFarmer,
	getSingleAppointment,
	updateAppointment,
	reschedureAppointment,
	deleteAppointment,
	deleteAllAppointments,
};
