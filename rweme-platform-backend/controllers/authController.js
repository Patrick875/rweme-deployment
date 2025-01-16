const { Op } = require("@sequelize/core");
const { isCollectPasswordOrOTP, hashPassword } = require("../utils/passwordAndOTP");
const { User, Supplier, Veternary } = require("./../models/index");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../services/mailService");
const path = require("path");
const bcrypt = require("bcrypt");

const comfirmTemplate = path.join(__dirname, "../views", "comfirmAccountEmail.ejs");
const accountComfirmedTemplate = path.join(__dirname, "../views", "accountComfirmed.ejs");
const forgotPasswordTemplate = path.join(__dirname, "../views", "forgotPassword.ejs");
const passwordChangedTemplate = path.join(__dirname, "../views", "passwordChanged.ejs");
const profileChangedTemplate = path.join(__dirname, "../views", "profileChanged.ejs");

function signToken(user) {
	const token = jwt.sign(user, process.env.JWT_SECRET);
	return token;
}

function setAuthCookie(res, token, name) {
	res.cookie(name, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production" ? true : false,
		sameSite: "lax",
		maxAge: 24 * 60 * 60 * 1000,
	});
}
function clearAuthCookie(res, name) {
	res.clearCookie(name, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production" ? true : false,
		sameSite: "None",
	});
}
async function userAlreadyExists(userId = "", email, telephone) {
	let alreadyExists;
	if (userId == "") {
		if (email && email !== "") {
			alreadyExists = await User.findOne({
				where: {
					email: email,
				},
			});
			return alreadyExists;
		}
		if (telephone && telephone !== "") {
			alreadyExists = await User.findOne({
				where: {
					telephone,
				},
			});
			return alreadyExists;
		}
	} else {
		if (email && email != "") {
			alreadyExists = await User.findOne({
				where: {
					id: { [Op.not]: userId },
					email,
				},
			});
			return alreadyExists;
		}
		if (telephone && telephone !== "") {
			alreadyExists = await User.findOne({
				where: {
					id: { [Op.not]: userId },
					telephone,
				},
			});
			return alreadyExists;
		}
	}
	return alreadyExists;
}
const createUser = async (req, res, next) => {
	try {
		const { fullName, telephone, password, addressId, role, email, nationalId } = req.body;

		const alreadyExists = userAlreadyExists("", email, telephone);

		if (alreadyExists) {
			return res.status(400).json({
				status: "Error",
				message: "User with phone or email already exists",
			});
		}

		const randomInt = parseInt(crypto.randomBytes(4).toString("hex"), 16) % 1000000000;
		const account_verication_code = randomInt.toString().padStart(9, "0");

		const hashedPassword = await hashPassword(password);

		const createdUser = await User.create({
			fullName,
			telephone,
			email,
			hashedPassword,
			nationalId,
			role,
			addressId,
			status: "Pending",
			account_comfirm_code: account_verication_code,
			account_confirm_createdAt: new Date().getTime(),
		});
		req.userId = createdUser.id;
		sendEmail(email, "Welcome to Rweme-Platform", comfirmTemplate, { fullName, email, verificationCode: account_verication_code });
		next();
	} catch (error) {
		console.log("err", error.errors);
		// console.log("err", error);
		return res.status(400).json({
			message: "User create failed",
		});
	}
};

const updateUserSelf = async (req, res, next) => {
	const loggedInUserId = req.userId;
	const requestingUser = await User.findOne({ where: { id: loggedInUserId } });
	const requestingUserObj = requestingUser.toJSON();
	const { fullName, email, telephone, addressId, nationalId } = req.body;
	const alreadyExists = await userAlreadyExists(loggedInUserId, email, telephone);

	if (alreadyExists) {
		return res.status(400).json({
			status: "Error",
			message: "User with phone or email already exists",
		});
	}

	const incomingFields = { fullName, email, telephone, addressId, nationalId };
	const updatableFields = {};
	for (const key in incomingFields) {
		if (Object.prototype.hasOwnProperty.call(incomingFields, key)) {
			const element = incomingFields[key];

			if (element == null || element == undefined || element == "") {
				delete incomingFields[key];
			} else {
				updatableFields[key] = element;
			}
		}
	}
	if (Object.values(updatableFields).length !== 0) {
		await User.update(
			{
				...updatableFields,
			},
			{
				where: {
					id: loggedInUserId,
				},
			}
		);
		await sendEmail(requestingUserObj.email, "User profile updated", profileChangedTemplate, { fullName: requestingUserObj.fullName });
	}
	return res.status(203).json({
		status: "Success",
		message: "User info updated successfully!!!",
	});
};
const updateUserByAdmin = async (req, res, next) => {
	const { fullName, id, addressId } = req.body;

	await User.update(
		{
			fullName,
			addressId,
		},
		{
			where: {
				id,
			},
		}
	);

	return res.status(203).json({
		status: "Success",
		message: "User info updated successfully!!!",
	});
};
const login = async (req, res) => {
	const { login, password } = req.body;

	if (!login || !password) {
		return res.status(400).json({
			message: "Missing login details",
		});
	}
	const user = await User.scope("auth").findOne({
		where: {
			[Op.or]: [{ email: login }, { telephone: login }],
		},
		include: [{ model: Supplier }, { model: Veternary }],
	});

	console.log("passowrd-user", {
		password,
		user,
	});

	const collectPassword = await isCollectPasswordOrOTP(password, user?.password);

	if (!user || !collectPassword) {
		return res.status(401).json({
			status: "Failed",
			message: "Wrong email or password !!!",
		});
	}
	if (user.status !== "Active") {
		return res.status(403).json({
			message: "User account can not login into the system. Contact admin for more info",
			status: "failed",
		});
	}
	const userObj = user.toJSON();
	const token = signToken(userObj);
	setAuthCookie(res, token, "authToken");
	req.user = user;
	return res.status(200).json({
		status: "success",
		data: user,
	});
};
const logout = (req, res) => {
	clearAuthCookie(res, "authToken");
	req.user = null;
	res.status(200).json({
		message: "Logged out successfully!!!!",
	});
};
const confirmAccount = async (req, res) => {
	const { email, verificationCode } = req.body;

	if (!email || !verificationCode) {
		return res.status(400).json({
			status: "Failed",
			message: "Both email and verification code are required",
		});
	}

	const accountToVerify = await User.findOne({
		where: {
			account_comfirm_code: verificationCode,
		},
	});
	if (!accountToVerify) {
		return res.status(404).json({
			status: "Failed",
			message: "Account with verification code not found!",
		});
	}
	const defaultPassword = await hashPassword("Rweme_2024!");
	await User.update(
		{ status: "Active", account_comfirm_code: null, password: defaultPassword },
		{
			where: {
				id: accountToVerify.id,
			},
		}
	);
	sendEmail(accountToVerify.email, "RWEME-PLATFORM -Account Comfirmed", accountComfirmedTemplate, { fullName: accountToVerify.fullName });
	return res.status(203).json({
		status: "Success",
		message: "Account verified !!!",
	});
};
const initiateForgotPassword = async (req, res) => {
	const { login } = req.body;

	const requestingUser = await User.findOne({
		where: {
			[Op.or]: [
				{
					email: login,
				},
				{
					telephone: login,
				},
			],
			status: "Active",
		},
	});
	if (!requestingUser) {
		return res.status(400).json({
			status: "Error",
			message: "Failed !!! User not found or is not active",
		});
	}
	const userObj = requestingUser.toJSON();
	const resetPasswordToken = signToken({ id: userObj.id, email: userObj.email });
	await User.update(
		{
			resetPasswordToken,
		},
		{
			where: { id: userObj.id },
		}
	);
	await sendEmail(userObj.email, "Reset password", forgotPasswordTemplate, {
		fullName: userObj.fullName,
		email: userObj.email,
		resetToken: resetPasswordToken,
	});
	return res.status(200).json({
		status: "Success",
		message: "Success. Please check your email for next steps.",
	});
};
const forgotPassword = async (req, res) => {
	const { email, token } = req.params;
	const { newPassword } = req.body;
	const requestingUser = await User.scope("auth").findOne({
		where: {
			[Op.or]: {
				email,
			},
			resetPasswordToken: token,
		},
	});
	// const decodedToken = jwt.decode(token);
	// if(decodedToken.id!==requestingUser.toJSON().id){
	// 	return res.status()
	// }
	// console.log("decodedToken", decodedToken);

	if (!requestingUser) {
		return res.status(404).json({
			status: "User not found",
			message: "User not found",
		});
	}

	const userObj = requestingUser.toJSON();
	const isCurrentPassword = await bcrypt.compare(newPassword, userObj.password);
	if (isCurrentPassword) {
		return res.status(400).json({
			status: "Error",
			message: "Can not use old password as new password. Please use a different password",
		});
	}
	const newPasswordHashed = await hashPassword(newPassword);
	await User.update(
		{
			password: newPasswordHashed,
			resetPasswordToken: null,
		},
		{
			where: {
				id: userObj.id,
			},
		}
	);
	sendEmail(userObj.email, "Password Changed !!!", passwordChangedTemplate, { fullName: userObj.fullName });
	return res.status(203).json({
		status: "Success",
		message: "Password succefully updated !!!",
	});
};
const changePassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	const requestingUserId = req.userId;
	const requestingUser = await User.scope("auth").findOne({
		where: {
			id: requestingUserId,
		},
	});
	const requestingUserObj = requestingUser.toJSON();
	const isCollectOldPassword = await isCollectPasswordOrOTP(oldPassword, requestingUserObj.password);
	const passwordNotChanged = await isCollectPasswordOrOTP(newPassword, requestingUserObj.password);
	if (!isCollectOldPassword) {
		return res.status(400).json({
			status: "Error",
			message: "Wrong old password",
		});
	}
	if (passwordNotChanged) {
		return res.status(400).json({
			status: "Error",
			message: "Can not use old password as new password",
		});
	}

	const newPasswordHashed = await hashPassword(newPassword);
	await User.update(
		{
			password: newPasswordHashed,
		},
		{
			where: {
				id: requestingUserObj.id,
			},
		}
	);
	sendEmail(requestingUserObj.email, "Password Changed !!!", passwordChangedTemplate, { fullName: requestingUserObj.fullName });
	return res.status(203).json({
		status: "Success",
		message: "Password succefully updated !!!",
	});
};
module.exports = {
	login,
	logout,
	createUser,
	confirmAccount,
	forgotPassword,
	initiateForgotPassword,
	changePassword,
	updateUserSelf,
	updateUserByAdmin,
};
