const { Transaction, Farmer, Supplier, User, FoodRequest } = require("./../models");
const getAllTransactions = async (req, res) => {
	const transactions = await Transaction.findAll({
		include: [{ model: Farmer }, { model: Supplier, include: [{ model: User }] }, { model: FoodRequest }],
	});
	return res.status(200).json({
		status: "success",
		data: transactions,
		dataLength: transactions.length,
	});
};
const getTransactionsByFarmer = async (req, res) => {
	const { farmerId } = req.params;
	const transactions = await Transaction.findAll({
		where: {
			farmerId,
		},
		include: [{ model: Farmer }, { model: Supplier, include: [{ model: User }] }, { model: FoodRequest }],
	});
	return res.status(200).json({
		status: "success",
		data: transactions,
		dataLength: transactions.length,
	});
};
const getTransactionsBySupplier = async (req, res) => {
	const { supplierId } = req.params;
	const transactions = await Transaction.findAll({
		where: {
			supplierId,
		},
		include: [{ model: Farmer }, { model: Supplier, include: [{ model: User }] }, { model: FoodRequest }],
	});
	return res.status(200).json({
		status: "success",
		data: transactions,
		dataLength: transactions.length,
	});
};
const getSingleTranscaction = async (req, res) => {
	const { id } = req.params;
	const transactions = await Transaction.findAll({
		where: {
			id,
		},
		include: [{ model: Farmer }, { model: Supplier, include: [{ model: User }] }, { model: FoodRequest }],
	});
	return res.status(200).json({
		status: "success",
		data: transactions,
		dataLength: transactions.length,
	});
};
const deleteRecord = async (req, res) => {
	const { id } = req.params;
	await Transaction.destroy({
		where: {
			id,
		},
	});
	return res.status(204).json({
		status: "success",
		message: "Record deleted",
	});
};
const deleteAll = async (req, res) => {
	await Transaction.destroy({
		truncate: true,
	});
	return res.status(204).json({
		status: "success",
		message: " All Record deleted",
	});
};

module.exports = {
	getAllTransactions,
	getSingleTranscaction,
	getTransactionsByFarmer,
	getTransactionsBySupplier,
	deleteRecord,
	deleteAll,
};
