const { Op } = require("sequelize");
const { TypeOfChicken } = require("./../models/index");

const create = async (req, res) => {
	const { name } = req.body;
	try {
		const data = await TypeOfChicken.create({ name });
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
	const searchQuery = req.query.q;
	const searchCondition = {
		[Op.or]: [{ name: { [Op.iLike]: `%${searchQuery}%` } }],
	};
	try {
		const data = await TypeOfChicken.findAll({
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
		return res.status(500).json({
			message: "internal server error",
		});
	}
};
const update = async (req, res) => {
	const { typeId } = req.params;
	const { name } = req.body;
	if (!typeId) {
		return res.status(400).json({
			status: "Failed",
			message: "typeId is required",
		});
	}
	try {
		await TypeOfChicken.update(
			{ name },
			{
				where: {
					id: typeId,
				},
			}
		);
		const updated = await TypeOfChicken.findByPk(typeId);
		return res.status(203).json({
			status: "Success",
			data: updated,
			message: "Updated",
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "internal server error",
		});
	}
};
const deleteTypeOfChicken = async (req, res) => {
	const { typeId } = req.params;
	if (!typeId) {
		return res.status(400).json({
			status: "Failed",
			message: "typeId is required",
		});
	}
	try {
		await TypeOfChicken.destroy({ where: { id: typeId } });
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

module.exports = { create, getAll, update, deleteTypeOfChicken };
