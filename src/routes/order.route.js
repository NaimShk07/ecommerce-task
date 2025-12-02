const express = require("express");
const router = express.Router();
const {
	createOrder,
	getOrderById,
	updateOrderStatus,
	listOrders,
} = require("../controllers/order.controller.js");
const { protect, authorize } = require("../middleware/auth.middleware.js");
const {
	createOrderValidation,
	updateStatusValidation,
} = require("../validations/order.validation.js");
const validate = require("../middleware/validate.middleware.js");

router.use(protect);

router.post(
	"/",
	authorize("User"),
	validate(createOrderValidation),
	createOrder
);
router.get("/", listOrders);
router.get("/:id", getOrderById);
router.patch(
	"/:id/status",
	authorize("Admin"),
	validate(updateStatusValidation),
	updateOrderStatus
);

module.exports = router;
