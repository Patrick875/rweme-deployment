const express = require("express");
const { param, body } = require("express-validator");
const asyncWrapper = require("./../utils/asyncWrapper");
const {
	create,
	getAllAppointments,
	updateAppointment,
	reschedureAppointment,
	deleteAppointment,
	getSingleAppointment,
	getAllAppointmentsByFarmer,
	getAllAppointmentsByVet,
	deleteAllAppointments,
} = require("./../controllers/appointementController");
const authMiddleWare = require("../services/authenticationMiddleware");

const router = express.Router();

router.get("/", authMiddleWare(["Admin"]), asyncWrapper(getAllAppointments));
router.get(
	"/:id",
	[param("id").notEmpty().isUUID().withMessage("Invalid appointment ID. Must be a valid UUID.")],
	authMiddleWare(["Admin", "Veternary"]),
	asyncWrapper(getSingleAppointment)
);
router.get(
	"/veternary/:veternaryId",
	[param("veternaryId").notEmpty().isUUID().withMessage("Invalid param veternaryId must be a valid uuid")],
	authMiddleWare(["Admin", "Veternary"]),
	asyncWrapper(getAllAppointmentsByVet)
);
router.get(
	"/farmer/:farmerId",
	[param("farmerId").notEmpty().isUUID().withMessage("Invalid farmerId, must be a valid UUID")],
	authMiddleWare(["Admin", "Veternary"]),
	asyncWrapper(getAllAppointmentsByFarmer)
);

router.post("/", authMiddleWare(["Admin", "Veternary"]), asyncWrapper(create));

router.patch(
	"/:id",
	[
		param("id").isUUID().withMessage("Invalid appointment ID. Must be a valid UUID.").trim(),
		body("farmerId").optional().isUUID().withMessage("Invalid farmerId. Must be a valid UUID."),
		body("veterinaryId").optional().isUUID().withMessage("Invalid veterinaryId. Must be a valid UUID."),
	],
	authMiddleWare(["Admin", "Veternary"]),
	asyncWrapper(updateAppointment)
);
router.patch(
	"/reschedure/:id",
	[param("id").isUUID().withMessage("Invalid appointment ID. Must be a valid UUID").trim()],
	authMiddleWare(["Admin", "Veternary"]),
	asyncWrapper(reschedureAppointment)
);
router.delete(
	"/:id",
	authMiddleWare(["Admin"]),
	[param("id").isUUID().withMessage("Invalid appointment ID. Must be a valid UUID").trim()],
	asyncWrapper(deleteAppointment)
);
router.delete("/", authMiddleWare(["Admin"]), asyncWrapper(deleteAllAppointments));

module.exports = router;
