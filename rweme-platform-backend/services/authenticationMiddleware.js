const { Op } = require("sequelize");
const { User, Veternary, Supplier } = require("./../models");
const jwt = require("jsonwebtoken");
const authMiddleWare = (allowedRoles = ["Admin", "Veternary", "Supplier"]) => {
	return async (req, res, next) => {
		const token = req.cookies.authToken;
		if (!token) {
			res.clearCookie("authToken", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "None",
			});

			return res.status(403).json({
				status: "Not authenticated",
				message: "Not authenticated !! Access denied.",
			});
		}
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({
				where: {
					[Op.or]: {
						email: decoded.email,
						telephone: decoded.telephone,
					},
				},
				include: [{ model: Veternary }, { model: Supplier }],
			});
			if (!user) {
				res.clearCookie("authToken", {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "None",
				});

				return res.status(403).json({
					status: "Access Denied",
					message: "User not found !! Access denied.",
				});
			}
			if (user && !allowedRoles.includes(decoded.role)) {
				return res.status(403).json({
					status: "Access Denied",
					message: "User missing rights to perform action. Access denied.",
				});
			}
			if (user && user.status !== "Active") {
				return res.status(403).json({
					message: "User account not active.Access denied.",
				});
			}

			req.userId = user.id;
			if (user.toJSON().role == "Veternary") {
				req.uservetId = user.toJSON().Veternary.id;
			}
			next();
		} catch (error) {
			console.log("err", error);
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Token has expired. Please login again." });
			} else if (error.name === "JsonWebTokenError") {
				return res.status(401).json({ message: "Invalid token. Please login again." });
			} else {
				return res.status(500).json({ message: "Something went wrong during authentication." });
			}
		}
	};
};
module.exports = authMiddleWare;
