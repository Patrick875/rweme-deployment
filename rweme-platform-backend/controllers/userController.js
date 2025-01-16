const { User, Village } = require("./../models/");
const getSingleUser = async (req, res) => {
	const { id } = req.params;

	const fetchedUser = await User.findOne({
		where: {
			id,
		},
		include: [{ model: Village }],
	});
	return res.status(200).json({
		status: "Success",
		data: fetchedUser,
	});
};
const getAllUsers = async (req, res) => {
	const allUsers = await User.findAll({
		include: [{ model: Village }],
	});
	return res.status(200).json({
		status: "Success",
		data: allUsers,
		dataLength: allUsers.length,
	});
};

const deleteUser = async (req, res) => {
	const { id } = req.params;

	await User.destroy({
		where: {
			id,
		},
	});
	return res.status(204).json({
		status: "Success",
		message: "User deleted successfuly",
	});
};
module.exports = { getAllUsers, getSingleUser, deleteUser };
