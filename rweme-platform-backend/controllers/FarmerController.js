const { Op } = require("sequelize");
const {
	Farmer,
	FarmStatus,
	User,
	Village,
	District,
	sector,
	Province,
	Cell,
	Veternary,
	TypeOfChicken,
	TypeOfFeed,
	FoodRequest,
	FarmerContract,
	Supplier,
	Appointment,
} = require("../models/");
const { generateOTP } = require("../utils/passwordAndOTP");
const { sendFarmerConfirmationOTP } = require("../services/smsService");
const { createPDF } = require("../services/farmerContract");
const { sendEmail } = require("./../services/mailService");
const path = require("path");
//send OTP to email,
//handle the contract,
//add a farmer status immediately,
//add a route for verternary specializations , seeed a default one
//seed types of chicken--done
// add next of to farmer table
const newFoodRequestTemplate = path.join(__dirname, "/../views", "foodRequestNotificationEmail.ejs");

const notDeleteCondition = {
	[Op.not]: [{ status: "Deleted" }],
};
const foodRequestIncludesArray = [{ model: Farmer }, { model: Supplier, include: [{ model: User }] }];

const create = async (req, res) => {
	const {
		fullName,
		email,
		telephone,
		nationalId,
		addressId,
		numberOfChicken,
		typeOfFeed,
		nextOfKin,
		amountOfFeedOnDailyBasisPerChicken,
		hasInsurance,
		typeOfChicken,
		chickenHealthCondition,
		amountOfFeedToBeDelivered,
		priceOfFeedToBeDelivered,
		assignedTo,
		supplierId,
	} = req.body;

	if (!fullName || !telephone || !nationalId) {
		return res.status(400).json({
			status: "Invalid request",
			message: "Fullname, Telephone and NationalId must be provided",
		});
	}
	const farmer = await Farmer.create({
		fullName,
		email,
		telephone,
		nationalId,
		addressId,
		numberOfChicken,
		hasInsurance: hasInsurance === "yes" ? true : false,
		nextOfKin,
		isContractSigned: false,
		status: "Pending",
		assignedTo,
	});
	const totalAmountToBePaid = amountOfFeedToBeDelivered * priceOfFeedToBeDelivered;

	const startingStatus = await FarmStatus.create({
		farmerId: farmer.id,
		numberOfChicken: numberOfChicken,
		typeOfFeed: typeOfFeed,
		amountOfFeedOnDailyBasisPerChicken,
		amountOfFeedToBeDelivered,
		priceOfFeedToBeDelivered,
		totalAmountToBePaid,
		hasInsurance: hasInsurance === "yes" ? true : false,
		chickenTypeId: typeOfChicken,
		chickenHealth: chickenHealthCondition,
		recordedOn: new Date().toISOString(),
		recordedBy: req.userId,
	});
	const today = new Date();
	const farmerTypeOfFeed = await TypeOfFeed.findByPk(typeOfFeed);
	const farmerTypeOfChicken = await TypeOfChicken.findByPk(typeOfChicken);

	const firstInstallmentAt =
		farmerTypeOfChicken?.dataValues.name.toUpperCase() == "LAYER"
			? new Date().setDate(today.getDate() + 14)
			: new Date().setDate(today.getDate() + 30);
	const secondInstallmentAt = new Date().setDate(today.getDate() + 30);
	//update farmer object
	await Farmer.update(
		{
			veternaryInCharge: req.loggedInUserName,
			typeOfFeed: farmerTypeOfFeed ? farmerTypeOfFeed.name : null,
			typeOfChicken: farmerTypeOfChicken ? farmerTypeOfChicken.name : null,
		},
		{
			where: {
				id: farmer.id,
			},
		}
	);
	const timeStamp = new Date().toLocaleDateString("fr-FR");
	const fileName = `${fullName} Contract-${timeStamp}`;
	let farmerContractURL = "";
	const createdFarmer = await Farmer.scope("auth").findOne({
		where: { id: farmer.id },
		include: [
			{ model: FarmerContract },
			{ model: Veternary, include: [{ model: User }] },
			{ model: Village, include: [{ model: District }, { model: sector }, { model: Cell }] },
		],
	});
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
	await FoodRequest.create({
		farmerId: farmer.toJSON().id,
		typeOfFeed,
		quantityOfFeed: amountOfFeedToBeDelivered,
		amountOfFeedToBeDelivered,
		price: priceOfFeedToBeDelivered,
		totalAmount: totalAmountToBePaid,
		supplierId,
		deliveryStatus: "PENDING",
		status: "IN-PROCESS",
	});

	await sendEmail(supplier.toJSON().User.email, "RWEME New Food Request", newFoodRequestTemplate, { fullName: supplier.toJSON().User.fullName });

	await createPDF(
		{ fileName, famer: fullName, tel: telephone },
		{
			...createdFarmer.toJSON(),
			fullName,
			typeOfFeed: createdFarmer.toJSON().typeOfFeed,
			typeOfChicken: createdFarmer.toJSON().typeOfChicken,
			nationalId,
			telephone,
			farmerDistrict: createdFarmer.toJSON().Village.District.name,
			farmerSector: createdFarmer.toJSON().Village.sector.name,
			farmerCell: createdFarmer.toJSON().Village.Cell.name,
			farmerVillage: createdFarmer.toJSON().Village.name,
			numberOfChicken,
			nextOfKin,
			amountOfFeedToBeDelivered,
			priceOfFeedToBeDelivered,
			totalAmountToBePaid,
			firstInstallmentAt,
			secondInstallmentAt,
		}
	).then((result) => {
		farmerContractURL = result;
	});

	await FarmerContract.create({
		farmerId: farmer.id,
		contractLink: farmerContractURL,
	});
	if (farmerContractURL !== "") {
		await Farmer.update(
			{
				contractLink: farmerContractURL,
			},
			{
				where: {
					id: farmer.id,
				},
			}
		);
	}

	return res.status(201).json({
		status: "success",
		data: { ...createdFarmer.dataValues, FarmStatus: startingStatus },
		message: "Farmer created successfully !!!",
	});
};

const sendComfirmOtp = async (req, res) => {
	const farmerId = req.params.farmerId;

	const farmer = await Farmer.findByPk(farmerId);
	if (!farmer) {
		return res.status(400).json({
			status: "failed",
			message: "farmer not found",
		});
	}
	const confirmationOTP = generateOTP();
	await Farmer.update(
		{
			signupOTP: confirmationOTP.otp,
			signupOTPExpiresAt: confirmationOTP.expirationTime,
		},
		{
			where: {
				id: farmerId,
			},
		}
	);
	await sendFarmerConfirmationOTP(farmer.fullName, farmer.telephone, confirmationOTP.otp);
	return res.status(203).json({
		status: "success",
		message: "Comfirmation code sent!!!",
	});
};

const comfirmOTP = async (req, res) => {
	const { otp } = req.body;
	if (!otp) {
		return res.status(400).json({
			status: "Bad Request",
			message: "Please send the OTP",
		});
	}
	const farmerWithOTP = await Farmer.findOne({
		where: {
			signupOTP: otp,
			isContractSigned: false,
			status: "Pending",
		},
	});
	if (!farmerWithOTP) {
		return res.status(404).json({
			status: "Farmer not found",
			message: "Farmer with OTP who hasn't signed the contract not found",
		});
	}
	if (Date.now() > farmerWithOTP.otpExpiresAt) {
		return res.status(401).json({
			status: "Expired",
			message: "OTP expired",
		});
	}

	await Farmer.update(
		{
			isContractSigned: true,
			status: "Active",
			signupOTP: null,
		},
		{
			where: { id: farmerWithOTP.id },
		}
	);
	const today = new Date();
	const appointmentmentDate = today.getDate() + 14;
	await Appointment.create({
		farmerId: farmerWithOTP.toJSON().id,
		veternaryId: farmerWithOTP.toJSON().assignedTo,
		currentDate: new Date(appointmentmentDate).toISOString(),
		status: "PENDING",
		dates: [new Date(appointmentmentDate).toLocaleDateString("fr-FR")],
	});

	return res.status(200).json({
		status: "Success",
		message: "Farmer OTP Code confirmed",
	});
};
const getAllFarmers = async (req, res) => {
	const searchQuery = req.query.q || "";
	const farmerSearch = {
		[Op.or]: [
			{ fullName: { [Op.iLike]: `%${searchQuery}%` } },
			{ telephone: { [Op.iLike]: `%${searchQuery}%` } },
			{ nationalId: { [Op.iLike]: `%${searchQuery}%` } },
			{ "$Village.name$": { [Op.iLike]: `%${searchQuery}%` } },
		],
	};

	const farmers = await Farmer.findAll({
		where: {
			...notDeleteCondition,
			...farmerSearch,
		},
		include: [
			{
				model: Village,
			},
			{ model: Veternary, include: [{ model: User }] },

			{ model: FarmerContract },
		],
	});
	return res.status(200).json({
		status: "success",
		data: farmers,
		dataLength: farmers.length,
	});
};
const getAllFarmersAssignedToVet = async (req, res) => {
	const { veternaryId } = req.params;
	const farmers = await Farmer.findAll({
		where: {
			assignedTo: veternaryId,
			status: "Active",
		},
	});
	return res.status(200).json({
		status: "success",
		data: farmers,
		dataLength: farmers.length,
	});
};
const getFarmer = async (req, res) => {
	const farmerId = req.params.farmerId;
	if (!farmerId) {
		return res.status(400).json({
			status: "Bad request",
			message: "Please provide the farmerId param",
		});
	}
	const farmer = await Farmer.findOne({
		where: {
			id: farmerId,
		},
		include: [
			{
				model: FarmStatus,
				include: [
					{ model: TypeOfChicken, attributes: ["id", "name"] },
					{ model: TypeOfFeed, as: "typeofFeeds", attributes: ["id", "name"] },

					{ model: User, as: "collectedBy", attributes: ["fullName", "id"] },
				],
			},
			{ model: FarmerContract },
			{ model: Veternary, include: [{ model: User }] },
			{ model: Village, include: [{ model: Cell }, { model: sector }, { model: District }, { model: Province }] },
			{ model: FoodRequest, include: foodRequestIncludesArray },
		],
	});
	return res.status(200).json({
		status: "success",
		data: farmer,
	});
};

const deleteFarmer = async (req, res) => {
	const farmerId = req.params.farmerId;
	if (!farmerId) {
		return res.status(400).json({
			status: "Bad Request",
			message: "Missing FarmerId",
		});
	}
	const farmer = await Farmer.findByPk(farmerId);
	if (!farmer) {
		return res.status(400).json({
			status: "Bad Request",
			message: "Farmer with ID not found.",
		});
	}
	await Farmer.update(
		{ status: "Deleted", telephone: farmer.telephone + "_Deleted" + crypto.randomUUID() },
		{
			where: {
				id: farmerId,
			},
		}
	);
	return res.status(204).json({
		status: "Deleted",
		message: "Farmer deleted Successfuly!!!",
	});
};

module.exports = {
	create,
	getAllFarmers,
	getAllFarmersAssignedToVet,
	getFarmer,
	deleteFarmer,
	comfirmOTP,
	sendComfirmOtp,
};
