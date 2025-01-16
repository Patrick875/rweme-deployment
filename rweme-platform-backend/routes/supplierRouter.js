const express = require("express");
const router = express.Router();
const { create, getAllSuppliers, getOne, deleteSupplier, updateStatus, updateSupplier } = require("./../controllers/SupplierController");
const authController = require("./../controllers/authController");
const authMiddleWare = require("../services/authenticationMiddleware");

router.post("/", authMiddleWare(["Admin"]), authController.createUser, create);
router.get("/", getAllSuppliers);
router.get("/:supplierId", authMiddleWare(["Admin"]), getOne);
router.patch("/status-update", authMiddleWare(["Admin"]), updateStatus);
router.patch("/:supplierId", updateSupplier);
router.delete("/:supplierId", authMiddleWare(["Admin"]), deleteSupplier);

module.exports = router;
