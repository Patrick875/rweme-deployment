const { FarmStatus, FarmStatusTypeOfFeed, TypeOfChicken, TypeOfFeed, Veternary, User } = require("../models/index");
const createFarmStatus = async (req, res) => {
	const {
		farmerId,
		numberOfChicken,
		typeOfFeed,
		amountOfFeedOnDailyBasisPerChicken,
		hasInsurance,
		chickenTypeId,
		chickenHealthCondition,
		priceOfFeedToBeDelivered,
		amountOfFeedToBeDelivered,
		recordedOn,
	} = req.body;
	const newFarmStatus = await FarmStatus.create({
		farmerId,
		numberOfChicken,
		amountOfFeedOnDailyBasisPerChicken,
		hasInsurance,
		chickenTypeId,
		chickenHealth: chickenHealthCondition,
		amountOfFeedToBeDelivered,
		priceOfFeedToBeDelivered,
		totalAmountToBePaid: amountOfFeedToBeDelivered * priceOfFeedToBeDelivered,
		recordedOn: new Date().toISOString(),
		recordedBy: req.userId,
	});

	if (typeOfFeed && typeOfFeed.length > 0) {
		const typeOfFeeds = typeOfFeed.map((id) => ({
			typeOfFeedId: id,
			farmStatusId: newFarmStatus.id,
		}));

		await FarmStatusTypeOfFeed.bulkCreate(typeOfFeeds);
	}

	return res.status(201).json({
		status: "success",
		data: newFarmStatus,
		message: "created successfuly",
	});
};
const getAll = async (req, res) => {
	const result = await FarmStatus.findAll({
		include: [
			{ model: TypeOfFeed, as: "typeofFeeds" },
			{ model: User, as: "collectedBy" },
		],
	});
	return res.status(200).json({
		message: "farm statuses",
		data: result,
	});
};
const getAllByVet = async (req, res) => {
	const { veternaryUserId } = req.params;
	const farmStatuses = await FarmStatus.findAll({
		where: {
			recordedBy: veternaryUserId,
		},
		include: [
			{
				model: User,
				as: "collectedBy",
			},
			{ model: TypeOfChicken },
		],
	});
	return res.status(200).json({
		status: "Success",
		data: farmStatuses,
		dataLength: farmStatuses.length,
	});
};
const deleteRecord = async (req, res) => {
	const { id } = req.params;
	await FarmStatus.destroy({
		where: {
			id,
		},
	});
	return res.status(204).json({
		status: "Success",
		message: "Deleted successfully",
	});
};
const deleteAll = async (req, res) => {
	await FarmStatus.destroy({
		truncate: true,
	});
	return res.status(204).json({
		status: "Success",
		message: "Delete successfully",
	});
};
module.exports = { createFarmStatus, getAll, getAllByVet, deleteRecord, deleteAll };
