const { Specialization } = require("./../models/index");
const { Op } = require("sequelize");

const create = async (req, res) => {
	const { name } = req.body;
	try {
		const data = await Specialization.create({ name });
		return res.status(201).json({
			status: "success",
			data,
			message: "Created !!!",
		});
	} catch (error) {
		return res.status(500).json({
			message: "internal server error",
		});
	}
};
const getAll = async (req, res) => {
	const searchQuery = req.query.q || "";
	const searchCondition = {
		[Op.or]: [{ name: { [Op.iLike]: `%${searchQuery}%` } }],
	};
	try {
		const data = await Specialization.findAll({
			where: {
				...searchCondition,
			},
		});
		return res.status(200).json({
			status: "success",
			data,
			dataLength: data.length,
		});
	} catch (error) {
		console.log("err", error);

		return res.status(500).json({
			message: "internal server error",
		});
	}
};
const updateSpecialization = async (req, res) => {
	const { specId } = req.params;
	const { name } = req.body;

	if (!specId) {
		return res.status(400).json({
			status: "Failed",
			message: "specId is required",
		});
	}
	try {
		await Specialization.update(
			{ name },
			{
				where: {
					id: specId,
				},
			}
		);
		const updatedSpec = await Specialization.findByPk(specId);
		return res.status(200).json({
			status: "success",
			data: updatedSpec,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "internal server error",
		});
	}
};
const deleteSpec = async (req, res) => {
	const { specId } = req.params;
	if (!specId) {
		return res.status(400).json({
			status: "Failed",
			message: "specId is required",
		});
	}
	try {
		await Specialization.destroy({
			where: { id: specId },
		});
		return res.status(204).json({
			status: "Success",
			message: "Deleted",
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "internal server error",
		});
	}
};

module.exports = { create, getAll, updateSpecialization, deleteSpec };
