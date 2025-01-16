const { Op } = require("sequelize");
const { Veternary, Village, Specialization, VeternarySpecialization, User } = require("./../models/index");

const allIncludesArray = [
	{
		model: Specialization,
		as: "specializations",
		attributes: ["id", "name"],
	},
	{
		model: User.scope("active"),
		include: [{ model: Village }],
		attributes: ["id", "fullName", "telephone", "email", "status", "nationalId"],
	},
];

const create = async (req, res) => {
	try {
		const veternary = await Veternary.create({
			userId: req.userId,
		});
		const { specializationIds } = req.body;

		if (specializationIds && specializationIds.length > 0) {
			const specializations = specializationIds.map((id) => ({
				veternaryId: veternary.id,
				specializationId: id,
			}));
			await VeternarySpecialization.bulkCreate(specializations);
		}
		res.status(201).json({
			status: "Successfully created",
			message: "Veternary created successfully!!!",
			data: veternary,
		});
	} catch (error) {
		console.log("err", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
const getAllVeternaries = async (req, res) => {
	const searchQuery = req.query.q || "";
	const searchCondition = {
		[Op.or]: [
			{ "$User.fullName$": { [Op.iLike]: `%${searchQuery}%` } },
			{ "$User.Village.name$": { [Op.iLike]: `%${searchQuery}%` } },
			{ "$User.email$": { [Op.iLike]: `%${searchQuery}%` } },
			{ "$User.telephone$": { [Op.iLike]: `%${searchQuery}%` } },
			{ "$specializations.name$": { [Op.iLike]: `%${searchQuery}%` } },
			// { "$User.status$": { [Op.iLike]: `%${searchQuery}%` } },
		],
	};
	try {
		const veternaries = await Veternary.findAll({
			where: { ...searchCondition },
			include: allIncludesArray,
		});
		return res.status(200).json({
			status: "Success",
			data: veternaries,
			dataLength: veternaries.length,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
const getOne = async (req, res) => {
	const { veternaryId } = req.params;
	if (!veternaryId) {
		return res.status(400).json({
			status: "Failed",
			message: "veternaryId is required",
		});
	}
	try {
		const vet = await Veternary.findOne({ where: { id: veternaryId }, include: allIncludesArray });
		if (!vet) {
			return res.status(404).json({
				status: "Failed",
				message: "Vet not found.",
			});
		}
		return res.status(200).json({
			status: "Success",
			data: vet,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			status: "failed",
			message: "Internal server error",
		});
	}
};
const deleteVeternary = async (req, res) => {
	const { veternaryId } = req.params;
	const random = crypto.randomUUID();
	if (!veternaryId) {
		return res.status(400).json({
			status: "Failed",
			message: "veternaryId is required",
		});
	}
	try {
		const vet = await Veternary.findByPk(veternaryId);
		if (!vet) {
			return res.status(404).json({
				status: "Failed",
				message: "Vet not found.",
			});
		}
		const vetUser = await User.findByPk(vet.userId);
		await User.update(
			{ status: "Deleted", telephone: vetUser.telephone + random, email: vetUser.email + random },
			{
				where: {
					id: vet.userId,
				},
			}
		);

		return res.status(204).json({
			status: "Success",
			message: "Deleted successfuly",
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "Something went wrong",
			status: "Internal server error",
		});
	}
};
const updateStatus = async (req, res) => {
	const { veternaryId, userId, status } = req.body;
	if (!veternaryId) {
		return res.status(400).json({
			status: "Failed",
			message: "VeternaryId and userId are required",
		});
	}
	try {
		const veternary = await Veternary.findOne({
			where: {
				id: veternaryId,
				userId,
			},
		});
		if (!veternary) {
			return res.status(404).json({
				status: "Failed",
				message: "Veternary account not found",
			});
		}
		await User.update(
			{ status },
			{
				where: {
					id: userId,
				},
			}
		);
		return res.status(203).json({
			status: "Success",
			message: "Veternary status updated successfuly!!!",
		});
	} catch (error) {
		return res.status(500).json({
			status: "Failed",
			message: "Internal server error",
		});
	}
};
const updateVet = async (req, res) => {
	const { veternaryId } = req.params;
	const { fullName, nationalId, addressId, specializationIds } = req.body;
	if (!veternaryId) {
		return res.status(400).json({
			status: "Failed",
			message: "VeternaryId as req param is required",
		});
	}
	try {
		const vet = await Veternary.findOne({
			where: {
				id: veternaryId,
			},
		});
		if (!vet) {
			return res.status(404).json({
				status: "Failed",
				message: "Vet with id not found or is not active",
			});
		}
		if (!Array.isArray(specializationIds)) {
			return res.status(400).json({
				status: "Failed",
				message: "specializationIds must an Array",
			});
		}
		await User.update(
			{ fullName, nationalId, addressId },
			{
				where: {
					id: vet.userId,
				},
			}
		);

		if (specializationIds.length !== 0) {
			await VeternarySpecialization.destroy({
				where: {
					veternaryId: vet.id,
				},
			});
			const specializations = specializationIds.map((id) => ({
				veternaryId: vet.id,
				specializationId: id,
			}));
			await VeternarySpecialization.bulkCreate(specializations);
		}
		const updatedVet = await Veternary.findByPk(veternaryId, {
			includes: allIncludesArray,
		});
		return res.status(203).json({
			status: "Success",
			message: "Updated successfully !!!",
			data: updatedVet,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			status: "Failed",
			message: "Internal server error ",
		});
	}
};
module.exports = { create, getAllVeternaries, getOne, deleteVeternary, updateStatus, updateVet };
