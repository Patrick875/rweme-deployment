const express = require("express");
const router = express.Router();
const { create, getAllTypesOfFeeds, updateTypeOfFeed, deleteTypeOfFeed } = require("./../controllers/typesOfFeedController");
const authMiddleWare = require("../services/authenticationMiddleware");

// authMiddleWare(["Admin"])
router.route("/").get(getAllTypesOfFeeds).post(create);
router.route("/:feedId").patch(updateTypeOfFeed).delete(deleteTypeOfFeed);

module.exports = router;
