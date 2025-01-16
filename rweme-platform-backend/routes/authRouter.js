const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const authMiddleWare = require("./../services/authenticationMiddleware");
const asyncWrapper = require("./../utils/asyncWrapper");
const {
	login,
	logout,
	confirmAccount,
	initiateForgotPassword,
	forgotPassword,
	changePassword,
	updateUserSelf,
	updateUserByAdmin,
} = require("./../controllers/authController");

router.post("/login", asyncWrapper(login));
router.post("/logout", logout);
router.patch("/confirm-account", asyncWrapper(confirmAccount));
router.post("/initiateForgotPassword", [body("login").notEmpty().isString("Login can not be an empty string")], asyncWrapper(initiateForgotPassword));
router.post("/forgotPassword/:email/:token", [param("email").isEmail(), body("newPassword").notEmpty().isString()], asyncWrapper(forgotPassword));
router.patch(
	"/changePassword",
	body(["oldPassword", "newPassword"]).notEmpty().isString(),
	authMiddleWare(["Admin", "Veternary", "Supplier"]),
	asyncWrapper(changePassword)
);
router.patch("/updateme", authMiddleWare(["Admin", "Veternary", "Supplier"]), asyncWrapper(updateUserSelf));
router.patch("/updateuser", body("id").notEmpty().isString(), authMiddleWare(["Admin"]), asyncWrapper(updateUserByAdmin));

module.exports = router;
