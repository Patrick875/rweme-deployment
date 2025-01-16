const { param } = require("express-validator");
const authMiddleWare = require("../services/authenticationMiddleware");
const foodRequestsController = require("./../controllers/foodRequestController");
const express = require("express");
const router = express.Router();

router.get("/", foodRequestsController.findAll);
router.get("/:foodReqId", foodRequestsController.getOne);
router.get("/farmer/:farmerId", foodRequestsController.findAllByFarmer);
router.get("/supplier/:supplierId", foodRequestsController.findAllBySupplier);
router.post("/", authMiddleWare(["Admin", "Veternary"]), foodRequestsController.create);
router.patch("/:reqId/initiatedelivery", foodRequestsController.initiateDelivery);
router.post("/comfirmdelivery", foodRequestsController.comfirmFoodDelivery);
router.delete(
	"/:id",
	authMiddleWare(["Admin"]),
	[param("id").notEmpty().isUUID().withMessage("food request id is required and must be a valid UUID")],
	foodRequestsController.deleteFoodRequest
);
router.delete("/", authMiddleWare(["Admin"]), foodRequestsController.deleteAllFoodRequests);

module.exports = router;
