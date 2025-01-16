const express = require("express");
const router = express.Router();
const { create, getAll, update, deleteTypeOfChicken } = require("./../controllers/typeOfChcikenController");

router.route("/").get(getAll).post(create);
router.route("/:typeId").patch(update).delete(deleteTypeOfChicken);
module.exports = router;
