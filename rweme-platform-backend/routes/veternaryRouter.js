const express = require("express");
const router = express.Router();
const { create, getAllVeternaries, getOne, deleteVeternary, updateStatus, updateVet } = require("./../controllers/VeternaryController");
const authController = require("./../controllers/authController");
const authMiddleWare = require("../services/authenticationMiddleware");

router.post("/", authMiddleWare(["Admin"]), authController.createUser, create);
router.get("/", getAllVeternaries);
router.patch("/status-update", authMiddleWare(["Admin"]), updateStatus);
// .all(authMiddleWare(["Admin"]))
router.route("/:veternaryId").get(getOne).patch(updateVet).delete(deleteVeternary);

module.exports = router;
