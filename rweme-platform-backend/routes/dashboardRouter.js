const express = require("express");
const { getDashboardData } = require("../controllers/dashboardDataController");
const asyncWrapper = require("./../utils/asyncWrapper");
const authMiddleWare = require("../services/authenticationMiddleware");
const router = express.Router();

router.get("/", authMiddleWare(["Admin", "Veternary", "Supplier"]), asyncWrapper(getDashboardData));

module.exports = router;
