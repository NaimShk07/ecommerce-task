const Order = require("../models/Order.model.js");
const Item = require("../models/Item.model.js");
const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const sendEmail = require("../services/emailService.js");
const generateInvoice = require("../services/invoiceService.js");

// Create new order
const createOrder = asyncHandler(async (req, res) => {
	const { items } = req.body;
	if (!items || items.length === 0)
		throw new ApiError("No items in the order", 400);

	let totalPrice = 0;
	const orderItems = [];

	for (const i of items) {
		const product = await Item.findById(i.item);
		if (!product) throw new ApiError("Item not found", 404);
		if (i.quantity > product.stock)
			throw new ApiError(`Not enough stock for item: ${product.name}`, 400);

		totalPrice += product.price * i.quantity;
		orderItems.push({
			item: product._id,
			quantity: i.quantity,
			price: product.price,
		});
	}

	const order = await Order.create({
		user: req.user._id,
		items: orderItems,
		totalPrice,
	});

	sendEmail({
		to: req.user.email,
		subject: `Order Confirmation - ${order._id}`,
		html: `<h1>Thank you for your order!</h1>
           <p>Your order ID is <strong>${order._id}</strong>.</p>
           <p>Total: $${order.totalPrice}</p>`,
	});

	generateInvoice({
		...order._doc,
		user: req.user,
		items: await Promise.all(
			order.items.map(async (i) => {
				const item = await Item.findById(i.item).lean();
				return { ...i._doc, item };
			})
		),
	}).catch((err) => console.error("Invoice generation failed:", err));

	const response = new ApiResponse(201, order, "Order created successfully");
	res.status(response.statusCode).json(response);
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id)
		.populate("user", "name email")
		.populate("items.item", "name price description");

	if (!order) throw new ApiError("Order not found", 404);
	if (
		req.user.role !== "Admin" &&
		order.user._id.toString() !== req.user._id.toString()
	) {
		throw new ApiError("Not authorized", 403);
	}

	const response = new ApiResponse(200, order, "Order fetched successfully");
	res.status(response.statusCode).json(response);
});

// Update order status (Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
	const { status } = req.body;
	const order = await Order.findById(req.params.id);
	if (!order) throw new ApiError("Order not found", 404);

	order.status = status;
	await order.save();

	const response = new ApiResponse(
		200,
		order,
		"Order status updated successfully"
	);
	res.status(response.statusCode).json(response);
});

// List orders with pagination & filters
const listOrders = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, status, fromDate, toDate } = req.query;
	const query = {};

	if (status) query.status = status;
	if (fromDate || toDate) {
		query.createdAt = {};
		if (fromDate) query.createdAt.$gte = new Date(fromDate);
		if (toDate) query.createdAt.$lte = new Date(toDate);
	}

	if (req.user.role !== "Admin") query.user = req.user._id;

	const orders = await Order.find(query)
		.populate("user", "name email")
		.populate("items.item", "name price")
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(parseInt(limit))
		.lean();

	const total = await Order.countDocuments(query);

	const response = new ApiResponse(
		200,
		{
			total,
			page: parseInt(page),
			pages: Math.ceil(total / limit),
			orders,
		},
		"Orders fetched successfully"
	);

	res.status(response.statusCode).json(response);
});

module.exports = {
	createOrder,
	getOrderById,
	updateOrderStatus,
	listOrders,
};
