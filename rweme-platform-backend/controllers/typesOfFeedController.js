const { TypeOfFeed } = require("./../models/index");
const { Op } = require("sequelize");

const create = async (req, res) => {
	try {
		const typeOfFeed = await TypeOfFeed.create({
			name: req.body.name,
		});
		res.status(201).json({
			status: "Successfully created",
			message: "Type of feed created successfully!!!",
			data: typeOfFeed,
		});
	} catch (error) {
		console.log("err", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
const getAllTypesOfFeeds = async (req, res) => {
	const searchQuery = req.query.q || "";
	const searchCondition = {
		[Op.or]: [{ name: { [Op.iLike]: `%${searchQuery}%` } }],
	};
	try {
		const typesOfFeed = await TypeOfFeed.findAll({
			where: {
				...searchCondition,
			},
		});
		return res.status(200).json({
			status: "Success",
			data: typesOfFeed,
			dataLength: typesOfFeed.length,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
const updateTypeOfFeed = async (req, res) => {
	const feedId = req.params.feedId;
	const { name } = req.body;
	if (!feedId) {
		return res.status(400).json({
			status: "Failed",
			message: "FeedId is required",
		});
	}
	try {
		await TypeOfFeed.update(
			{ name },
			{
				where: {
					id: feedId,
				},
			}
		);
		const updatedFeed = await TypeFeed.findByPk(feedId);
		return res.status(203).json({
			status: "Success",
			data: updatedFeed,
			message: "Feed updated succesfuly",
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "internal server error",
		});
	}
};
const deleteTypeOfFeed = async (req, res) => {
	const feedId = req.params.feedId;
	if (!feedId) {
		return res.statsu(400).json({
			status: "Failed",
			message: "feedId is required",
		});
	}
	try {
		await TypeOfFeed.destroy({ where: { id: feedId } });
		return res.status(204).json({
			status: "Success",
			message: "Resource deleted",
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "internal server error",
		});
	}
};

module.exports = { create, getAllTypesOfFeeds, updateTypeOfFeed, deleteTypeOfFeed };
