const express = require("express");
const router = express.Router();
const {
	getItems,
	createItem,
	updateItem,
} = require("../controllers/item.controller.js");
const { protect, authorize } = require("../middleware/auth.middleware.js");

router.get("/", getItems);
router.post("/", protect, authorize("Admin"), createItem);
router.patch("/:id", protect, authorize("Admin"), updateItem);

module.exports = router;
