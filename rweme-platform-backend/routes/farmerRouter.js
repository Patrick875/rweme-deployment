const express = require("express");
const router = express.Router();
const {
	create,
	comfirmOTP,
	getAllFarmers,
	sendComfirmOtp,
	getFarmer,
	deleteFarmer,
	getAllFarmersAssignedToVet,
} = require("./../controllers/FarmerController");
const authMiddleWare = require("../services/authenticationMiddleware");
const asyncWrapper = require("../utils/asyncWrapper");
const { param } = require("express-validator");

// router.use());
router.post("/", authMiddleWare(["Admin", "Veternary"]), asyncWrapper(create));
router.post("/sendotp/:farmerId", asyncWrapper(sendComfirmOtp));
router.post("/otpconfirm", asyncWrapper(comfirmOTP));
router.get("/", asyncWrapper(getAllFarmers));
router.get("/veternary/:veternaryId", [param("veternaryId").isUUID().notEmpty()], asyncWrapper(getAllFarmersAssignedToVet));

// router.use(authMiddleWare(["Admin"]));
router.get("/:farmerId", [param("farmerId").notEmpty().isUUID()], asyncWrapper(getFarmer));
router.delete("/:farmerId", [param("farmerId").notEmpty().isUUID()], asyncWrapper(deleteFarmer));

module.exports = router;
