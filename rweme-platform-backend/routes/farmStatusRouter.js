const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const { createFarmStatus, getAll, getAllByVet, deleteRecord, deleteAll } = require("./../controllers/farmStatusController");
const authMiddleWare = require("../services/authenticationMiddleware");
const asyncWrapper = require("../utils/asyncWrapper");

router.post("/", authMiddleWare(["Admin", "Veternary"]), asyncWrapper(createFarmStatus));
router.get("/", asyncWrapper(getAll));
router.get(
	"/veternary/:veternaryUserId",
	[param("veternaryUserId").notEmpty().isUUID().withMessage("param veternaryId is invalid")],
	asyncWrapper(getAllByVet)
);
router.delete(
	"/:id",
	[param("id").notEmpty().isUUID().withMessage("Farm status id is required and must be a valid UUID")],
	asyncWrapper(deleteRecord)
);
router.delete("/", asyncWrapper(deleteAll));

module.exports = router;
