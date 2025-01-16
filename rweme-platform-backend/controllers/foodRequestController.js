const { Op } = require("sequelize");
const {
	FoodRequest,
	Village,
	sector,
	District,
	Cell,
	FarmerContract,
	Farmer,
	TypeOfFeed,
	Supplier,
	User,
	Veternary,
	Transaction,
	Appointment,
} = require("./../models/index");
const { sendEmail } = require("../services/mailService");
const { createPDF } = require("../services/farmerContract");
const path = require("path");
const cron = require("node-cron-tz");
const { newFoodRequestNotification, sendComfirmFoodReceptionSMS } = require("../services/smsService");
const { generateOTP } = require("../utils/passwordAndOTP");
const { validate: isUuid } = require("uuid");
const { scheduleSMSForAppointment } = require("../services/cronJobs");
const generateTransactionId = require("../utils/transactionIdGenerator");
const newFoodRequestTemplate = path.join(__dirname, "/../views", "foodRequestNotificationEmail.ejs");

const includesArray = [
	{
		model: TypeOfFeed,
	},
	{ model: Farmer },
	{ model: Supplier, include: [{ model: User }] },
];
const farmerIncludesArray = [{ model: FarmerContract }, { model: Village, include: [{ model: District }, { model: sector }, { model: Cell }] }];
const create = async (req, res) => {
	const { farmerId, typeOfFeed, quantityOfFeed, amountOfFeedToBeDelivered, price, totalAmount, supplierId } = req.body;
	try {
		const foodRequest = await FoodRequest.create({
			farmerId,
			typeOfFeed,
			quantityOfFeed,
			amountOfFeedToBeDelivered,
			price,
			totalAmount,
			supplierId,
			deliveryStatus: "PENDING",
			status: "IN-PROCESS",
		});
		const farmer = await Farmer.findOne({
			where: {
				id: farmerId,
			},
			include: farmerIncludesArray,
		});
		if (!farmer) {
			return res.status(400).json({
				status: "Food Request Create failed",
				message: "farmer does not exist ",
			});
		}
		const supplier = await Supplier.findOne({
			where: {
				id: supplierId,
			},
			include: [
				{
					model: User,
					attributes: ["fullName", "email", "telephone"],
				},
			],
		});
		if (!supplier) {
			return res.status(400).json({
				status: "Food Request Create failed",
				message: "supplier does not exist ",
			});
		}
		if (!foodRequest) {
			return res.status(400).json({
				status: "Food Request Create failed",
				message: "error creating the food request",
			});
		}
		//update farmer contract
		const farmerObj = farmer.toJSON();
		const today = new Date();
		const firstInstallmentAt =
			farmerObj.typeOfChicken.toUpperCase() == "LAYER" ? new Date().setDate(today.getDate() + 14) : new Date().setDate(today.getDate() + 30);
		const secondInstallmentAt = new Date().setDate(today.getDate() + 30);
		const timeStamp = new Date().toString();

		let farmerContractURL = "";
		const fileName = `${farmerObj.fullName} Contract_${timeStamp}`;

		await createPDF(
			{ fileName, famer: farmerObj.fullName, tel: farmerObj.telephone },
			{
				...farmerObj,
				typeOfFeed: farmerObj.typeOfFeed,
				typeOfChicken: farmerObj.typeOfChicken,
				farmerDistrict: farmerObj.Village.District.name,
				farmerSector: farmerObj.Village.sector.name,
				farmerCell: farmerObj.Village.Cell.name,
				farmerVillage: farmerObj.Village.name,
				amountOfFeedToBeDelivered: quantityOfFeed,
				priceOfFeedToBeDelivered: price,
				totalAmountToBePaid: totalAmount,
				firstInstallmentAt,
				secondInstallmentAt,
			}
		).then((result) => {
			farmerContractURL = result;
		});
		await FarmerContract.create({
			farmerId: farmerId,
			contractLink: farmerContractURL,
		});
		if (farmerContractURL !== "") {
			await Farmer.update(
				{
					contractLink: farmerContractURL,
				},
				{
					where: {
						id: farmerId,
					},
				}
			);
		}
		//send Email
		const supplierRawData = supplier.dataValues.User.dataValues;
		sendEmail(supplierRawData.email, "RWEME New Food Request", newFoodRequestTemplate, { fullName: supplierRawData.fullName });
		//send email and text to supplier

		await newFoodRequestNotification(supplierRawData.fullName, supplierRawData.telephone);
		const foodRequestCreateResult = await FoodRequest.findByPk(foodRequest.id, {
			include: includesArray,
		});
		const appointmentmentDate = new Date().setDate(today.getDate() + 14);
		console.log("appointment-date", appointmentmentDate);

		const secondAppointmentmentDate = new Date().setDate(today.getDate() + 28);
		const veternary = await Veternary.findOne({
			where: {
				id: farmerObj.assignedTo,
			},
			include: [
				{
					model: User,
				},
			],
		});
		const veternaryObj = veternary.toJSON();
		await Appointment.create({
			farmerId: farmerId,
			veternaryId: farmerObj.assignedTo,
			status: "PENDING",
			currentDate: new Date(appointmentmentDate).toISOString(),
			dates: [new Date(appointmentmentDate).toLocaleDateString("fr-FR")],
		});

		const notificationTime = new Date();
		notificationTime.setMinutes(notificationTime.getMinutes() + 5);

		const scheduleCronTime = `${notificationTime.getUTCMinutes()} ${notificationTime.getUTCHours()} ${notificationTime.getUTCDate()} ${
			notificationTime.getUTCMonth() + 1
		} *`;

		cron.schedule(
			scheduleCronTime,
			() => {
				const message = `Mwiriwe ${farmerObj.fullName}, mumaze gusabirwa ibiryo.\nGahunda yo gusurwa na veternaire iteganyijwe tariki ya ${appointmentmentDate} na tariki ya ${secondAppointmentmentDate}.\n
				Muzajya mwibutswa mbere y' iminsi 2 na mbere y' umunsi umwe. Kwimura gahunda yo gusurwa mushobora kuvugana na veternaire uzabasura kuri ${veternaryObj.User.telephone}. Gahunda yimurwa 3.\n
				Mugire umunsi mwiza.\n
				RWEME PLATFORM`;
				sendSMS(`+25${farmer.telephone}`, message);
				// console.log(`Notification sent at ${new Date().toISOString()}`);
			},
			{ timezone: "Etc/GMT-2" }
		);

		scheduleSMSForAppointment(appointmentmentDate, farmerObj, veternaryObj);

		return res.status(201).json({
			status: "success",
			data: foodRequestCreateResult,
			message: "Created!",
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};
const findAll = async (req, res) => {
	const searchQuery = req.query.q || "";
	const searchCondition = {
		[Op.or]: [{ "$Farmer.fullName$": { [Op.iLike]: `%${searchQuery}%` } }, { "$Supplier.User.fullName$": { [Op.iLike]: `%${searchQuery}%` } }],
	};
	try {
		const all = await FoodRequest.findAll({
			where: {
				...searchCondition,
			},
			include: includesArray,
		});
		return res.status(200).json({
			status: "success",
			data: all,
			dataLength: all.length,
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: "Internal server error",
		});
	}
};
const findAllByFarmer = async (req, res) => {
	const farmerId = req.params.farmerId;
	const searchQuery = req.query.q || "";
	const searchCondition = {
		[Op.or]: [{ "$Supplier.User.fullName$": { [Op.iLike]: `%${searchQuery}%` } }],
	};
	if (!farmerId) {
		return res.status(400).json({
			status: "Bad Request",
			message: "farmerId is required",
		});
	}
	try {
		const foodRequests = await FoodRequest.findAll({
			where: {
				farmerId,
				...searchCondition,
			},
			include: includesArray,
		});
		return res.status(200).json({
			status: "success",
			data: foodRequests,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
const findAllBySupplier = async (req, res) => {
	const supplierId = req.params.supplierId;
	const searchQuery = req.query.q || "";
	const searchCondition = {
		[Op.or]: [{ "$Farmer.fullName$": { [Op.iLike]: `%${searchQuery}%` } }],
	};
	if (!supplierId) {
		return res.status(400).json({
			status: "Bad Request",
			message: "supplierId is required",
		});
	}
	try {
		const allRequests = await FoodRequest.findAll({
			where: {
				supplierId,
				...searchCondition,
			},
			include: includesArray,
		});

		return res.status(200).json({
			status: "success",
			data: allRequests,
			dataLength: allRequests.length,
		});
	} catch (error) {
		console.log("-err-err-err", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
const getOne = async (req, res) => {
	const { foodReqId } = req.params;
	if (!foodReqId || foodReqId == null) {
		return res.status(400).json({
			message: "Success",
			status: "Please provide the request ID",
		});
	}
	if (!isUuid(foodReqId)) {
		return res.status(400).json({
			status: "Error",
			message: "Invalid request ID format",
		});
	}
	const foodRequest = await FoodRequest.findOne({
		where: {
			id: foodReqId,
		},
		include: includesArray,
	});
	return res.status(200).json({
		status: "Success",
		data: foodRequest,
	});
};
const initiateDelivery = async (req, res) => {
	const { reqId } = req.params;
	const { farmerId } = req.body;
	if (!reqId || !farmerId) {
		return res.status(400).json({
			status: "Error",
			message: "Missing request Id or farmerIdp",
		});
	}
	try {
		const foodReq = await FoodRequest.findOne({
			where: {
				id: reqId,
				farmerId,
			},
			include: includesArray,
		});
		if (!foodReq) {
			return res.status(404).json({
				status: "Not Found",
				message: "food request with ID and farmerId not found",
			});
		}
		const comfirmOTP = await generateOTP(6);
		const smsDetails = {
			farmerFullName: foodReq.dataValues.Farmer.dataValues.fullName,
			farmerTelephone: foodReq.dataValues.Farmer.dataValues.telephone,
			supplierFullName: foodReq.dataValues.Supplier.User.fullName,
		};
		await FoodRequest.update(
			{ receptionComfirmationCode: comfirmOTP.otp },
			{
				where: {
					id: reqId,
				},
			}
		);
		console.log("the otp is", comfirmOTP.otp);

		await sendComfirmFoodReceptionSMS(smsDetails.farmerFullName, smsDetails.supplierFullName, smsDetails.farmerTelephone, comfirmOTP.otp);
		return res.status(203).json({
			status: "Success",
			message: "comfirmation code sent to farmer",
		});
	} catch (error) {
		return res.status(500).json({
			status: "Error",
			message: "Internal server error",
		});
	}
};
const comfirmFoodDelivery = async (req, res) => {
	const { otp, requestId } = req.body;
	if (!otp || !requestId) {
		return res.status(400).json({
			status: "Error",
			message: "otp and requestId are required",
		});
	}

	const foodReq = await FoodRequest.findOne({
		where: {
			receptionComfirmationCode: otp,
		},
	});
	if (!foodReq) {
		return res.status(400).json({
			status: "Error",
			message: "Food request with comfirmation code not found.",
		});
	}

	await FoodRequest.update(
		{
			deliveryStatus: "DELIVERED",
		},
		{
			where: {
				id: requestId,
			},
		}
	);
	const transactionId = await generateTransactionId();
	await Transaction.create({
		amount: foodReq.totalAmount,
		supplierId: foodReq.supplierId,
		transactionId,
		farmerId: foodReq.farmerId,
		foodRequestId: requestId,
		status: "PAID",
	});
	const updatedReq = await FoodRequest.findOne({
		where: {
			id: requestId,
		},
		include: includesArray,
	});
	return res.status(203).json({
		status: "Sucess",
		data: updatedReq,
		message: "Request delivered",
	});
};
const deleteFoodRequest = async (req, res) => {
	const { id } = req.params;
	await FoodRequest.destroy({
		where: {
			id,
		},
	});
	return res.status(204).json({
		status: "Success",
		message: "Food request deleted !!!",
	});
};
const deleteAllFoodRequests = async (req, res) => {
	await FoodRequest.destroy({
		truncate: true,
		force: true,
	});
	return res.status(204).json({
		status: "Success",
		message: "Deleted successfuly",
	});
};
module.exports = {
	create,
	findAll,
	getOne,
	findAllByFarmer,
	findAllBySupplier,
	initiateDelivery,
	comfirmFoodDelivery,
	deleteFoodRequest,
	deleteAllFoodRequests,
};
