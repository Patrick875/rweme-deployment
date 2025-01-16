const { Farmer, Supplier, FoodRequest, TypeOfFeed, Veternary, Village, Province, District, Appointment, User } = require("../models/");
const sequelize = require("sequelize");

const getDashboardData = async (req, res) => {
	const { Op } = sequelize;
	const demographicGrouping = req.query.groupFarmersBy || "province";

	let farmersGrouped = [];
	if (demographicGrouping === "district") {
		farmersGrouped = await Farmer.findAll({
			where: {
				status: { [Op.ne]: "Deleted" },
			},
			attributes: ["addressId", [sequelize.fn("COUNT", sequelize.col("Farmer.id")), "count"]],
			include: [
				{
					model: Village,
					include: [{ model: District, attributes: ["name"] }],
					attributes: ["districtId", "name"],
					required: true,
				},
			],
			group: ["Farmer.addressId", "Village.districtId", "Village.id", "Village.name", "Village->District.id", "Village->District.name"],
		});
	} else {
		farmersGrouped = await Farmer.findAll({
			where: {
				status: { [Op.ne]: "Deleted" },
			},
			attributes: ["addressId", [sequelize.fn("COUNT", sequelize.col("Farmer.id")), "count"]],
			include: [
				{
					model: Village,
					attributes: ["provinceId", "name"],
					include: [{ model: Province, attributes: ["name"] }],
					required: true,
				},
			],
			group: ["Farmer.addressId", "Village.provinceId", "Village.id", "Village->Province.id", "Village.name", "Village->Province.name"],
		});
	}
	const farmersCount = await Farmer.count({
		where: {
			status: {
				[Op.ne]: "Deleted",
			},
		},
	});

	const suppliersCount = await Supplier.count({
		include: [
			{
				model: User,
				where: {
					status: {
						[Op.ne]: "Deleted",
					},
				},
				required: true,
			},
		],
	});
	const veternariesCount = await Veternary.count({
		include: [
			{
				model: User,
				where: {
					status: {
						[Op.ne]: "Deleted",
					},
				},
				required: true,
			},
		],
	});
	const typeOfFeedData = await FoodRequest.findAll({
		attributes: [
			[sequelize.col("TypeOfFeed.name"), "name"],
			[sequelize.fn("COUNT", sequelize.col("FoodRequest.id")), "requests"],
		],
		include: [
			{
				model: TypeOfFeed,
			},
		],
		group: ["TypeOfFeed.id"],
	});
	let appointmentsCount;
	let farmersAssignedTo;
	if (req.uservetId) {
		appointmentsCount = await Appointment.count({
			where: {
				veternaryId: req.uservetId,
			},
		});
		farmersAssignedTo = await Farmer.count({
			where: {
				assignedTo: req.uservetId,
				status: "Active",
			},
		});
	}

	res.status(200).json({
		status: "Success",
		data: {
			farmers: farmersCount,
			suppliers: suppliersCount,
			veternaries: veternariesCount,
			farmersDemographics: farmersGrouped,
			typeOfFeedData,
			appointmentsCount: appointmentsCount || 0,
			farmersAssignedTo: farmersAssignedTo || 0,
		},
	});
};

module.exports = {
	getDashboardData,
};
