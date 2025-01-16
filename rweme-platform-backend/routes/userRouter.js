const express = require("express");
const authMiddleWare = require("../services/authenticationMiddleware");
const asyncWrapper = require("../utils/asyncWrapper");
const { getAllUsers, getSingleUser, deleteUser } = require("./../controllers/userController");
const { param } = require("express-validator");
const router = express.Router();

router.get("/", authMiddleWare(["Admin"], asyncWrapper(getAllUsers)));
router.get("/:id", [param("id").notEmpty().isUUID()], authMiddleWare(), asyncWrapper(getSingleUser));
router.delete("/:id", [param("id").notEmpty().isUUID()], authMiddleWare(["Admin"]), asyncWrapper(deleteUser));

module.exports = router;
