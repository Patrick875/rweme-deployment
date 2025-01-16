const express = require("express");
const router = express.Router();
const { create, getAll, updateSpecialization, deleteSpec } = require("./../controllers/specializationsController");

router.route("/").get(getAll).post(create);
router.route("/:specId").patch(updateSpecialization).delete(deleteSpec);
module.exports = router;
