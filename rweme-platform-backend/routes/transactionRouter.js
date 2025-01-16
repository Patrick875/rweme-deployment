const { param } = require("express-validator");
const authMiddleWare = require("../services/authenticationMiddleware");
const asyncWrapper = require("../utils/asyncWrapper");
const {
	getAllTransactions,
	getSingleTranscaction,
	getTransactionsBySupplier,
	getTransactionsByFarmer,
	deleteRecord,
	deleteAll,
} = require("./../controllers/transactionsController");
const express = require("express");
const router = express.Router();

router.get("/", authMiddleWare(["Admin"]), asyncWrapper(getAllTransactions));
router.get(
	"/:id",
	authMiddleWare(),
	[param("id").notEmpty().isUUID().withMessage("param id must be a valid UUID")],
	asyncWrapper(getSingleTranscaction)
);
router.get(
	"/supplier/:supplierId",
	authMiddleWare(["Admin", "Supplier"]),
	[param("supplierId").notEmpty().isUUID().withMessage("param supplierId must be a valid UUID")],
	asyncWrapper(getTransactionsBySupplier)
);
router.get(
	"/farmer/:farmerId",
	authMiddleWare(["Admin", "Supplier"]),
	[param("farmerId").notEmpty().isUUID().withMessage("param farmerId must be a valid UUID")],
	asyncWrapper(getTransactionsByFarmer)
);
router.delete("/:id", authMiddleWare(["Admin"]), asyncWrapper(deleteRecord));
router.delete("/", authMiddleWare(["Admin"]), asyncWrapper(deleteAll));

module.exports = router;
