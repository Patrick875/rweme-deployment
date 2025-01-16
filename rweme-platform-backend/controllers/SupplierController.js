const { Supplier, User, Village, TypeOfFeed, SupplierTypeOfFeed } = require("./../models/index");
const { Op } = require("sequelize");
const create = async (req, res) => {
	try {
		const supplier = await Supplier.create({
			userId: req.userId,
			momoPay: req.body.momoPay,
		});

		if (req.body.typeOfFeedIds && req.body.typeOfFeedIds.length > 0) {
			const feeds = req.body.typeOfFeedIds.map((id) => ({
				supplierId: supplier.id,
				typeOfFeedId: id,
			}));
			await SupplierTypeOfFeed.bulkCreate(feeds);
		}
		res.status(201).json({
			status: "Successfully created",
			message: "Supplier created successfully!!!",
			data: supplier,
		});
	} catch (error) {
		console.log("err", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
const getAllSuppliers = async (req, res) => {
	const searchQuery = req.query.q || "";
	const searchCondition = {
		[Op.or]: [
			{ "$User.fullName$": { [Op.iLike]: `%${searchQuery}%` } },
			{ "$User.telephone$": { [Op.iLike]: `%${searchQuery}%` } },
			{ "$User.email$": { [Op.iLike]: `%${searchQuery}%` } },
			{ "$User.Village.name$": { [Op.iLike]: `%${searchQuery}%` } },
			{ "$TypeOfFeed.name$": { [Op.iLike]: `%${searchQuery}%` } },
		],
	};
	try {
		const suppliers = await Supplier.findAll({
			where: {
				...searchCondition,
			},
			include: [
				{ model: User.scope("active"), include: [{ model: Village }] },
				{ model: TypeOfFeed, as: "TypeOfFeed", attributes: ["id", "name"] },
			],
		});
		return res.status(200).json({
			status: "Success",
			data: suppliers,
			dataLength: suppliers.length,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
const getOne = async (req, res) => {
	const { supplierId } = req.params;
	if (!supplierId) {
		return res.status(400).json({
			status: "Failed",
			message: "supplierId is required",
		});
	}
	try {
		const supplier = await Supplier.findOne({
			where: { id: supplierId },
			include: [
				{ model: User.scope("active"), include: [{ model: Village }] },
				{ model: TypeOfFeed, as: "TypeOfFeed", attributes: ["id", "name"] },
			],
		});
		if (!supplier) {
			return res.status(404).json({
				status: "Failed",
				message: "Supplier not found.",
			});
		}
		return res.status(200).json({
			status: "Success",
			data: supplier,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			status: "failed",
			message: "Internal server error",
		});
	}
};

const deleteSupplier = async (req, res) => {
	const random = crypto.randomUUID();
	const { supplierId } = req.params;
	if (!supplierId) {
		return res.status(400).json({
			status: "Failed",
			message: "supplierId is required",
		});
	}
	try {
		const supplier = await Supplier.findByPk(supplierId);
		const supUser = await User.findByPk(supplier.userId);
		if (!supplier) {
			return res.status(404).json({
				status: "Failed",
				message: "Supplier not found.",
			});
		}

		await User.update(
			{ status: "Deleted", telephone: supUser.telephone + random, email: supUser.email + random },
			{
				where: {
					id: supplier.userId,
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
	const { supplierId, userId, status } = req.body;
	if (!supplierId) {
		return res.status(400).json({
			status: "Failed",
			message: "SupplierId and userId are required",
		});
	}
	try {
		const supplier = await Supplier.findOne({
			where: {
				id: supplierId,
				userId,
			},
		});
		if (!supplier) {
			return res.status(404).json({
				status: "Failed",
				message: "Supplier account not found",
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
			message: "Supplier status updated successfuly!!!",
		});
	} catch (error) {
		return res.status(500).json({
			status: "Failed",
			message: "Internal server error",
		});
	}
};
const updateSupplier = async (req, res) => {
	const { supplierId } = req.params;
	const { fullName, nationalId, addressId, typeoffeeds, momoPay } = req.body;
	if (!supplierId) {
		return res.status(400).json({
			status: "Failed",
			message: "SupplierId as req param is required",
		});
	}
	try {
		const supplier = await Supplier.findOne({
			where: {
				id: supplierId,
			},
		});
		if (!supplier) {
			return res.status(404).json({
				status: "Failed",
				message: "Supplier with id not found or is not active",
			});
		}
		if (!Array.isArray(typeoffeeds)) {
			return res.status(400).json({
				status: "Failed",
				message: "typeoffeeds must an Array",
			});
		}
		await Supplier.update(
			{ momoPay },
			{
				where: {
					id: supplierId,
				},
			}
		);
		await User.update(
			{ fullName, nationalId, addressId },
			{
				where: {
					id: supplier.userId,
				},
			}
		);

		if (typeoffeeds.length !== 0) {
			await SupplierTypeOfFeed.destroy({
				where: {
					supplierId: supplier.id,
				},
			});
			const feeds = typeoffeeds.map((id) => ({
				supplierId: supplier.id,
				typeOfFeedId: id,
			}));
			await SupplierTypeOfFeed.bulkCreate(feeds);
		}
		const updatedSupplier = await Supplier.findByPk(supplierId, {
			includes: [
				{ model: User.scope("active"), include: [{ model: Village }] },
				{ model: TypeOfFeed, as: "TypeOfFeed", attributes: ["id", "name"] },
			],
		});
		return res.status(203).json({
			status: "Success",
			message: "Updated successfully !!!",
			data: updatedSupplier,
		});
	} catch (error) {
		console.log("err", error);
		return res.status(500).json({
			status: "Failed",
			message: "Internal server error ",
		});
	}
};

module.exports = { create, getAllSuppliers, getOne, deleteSupplier, updateStatus, updateSupplier };
