const Item = require("../models/Item.model.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all items
const getItems = asyncHandler (async (req, res) => {
	const items = await Item.find().lean();
	const response = new ApiResponse(200, items, "Items fetched successfully");
	res.status(response.statusCode).json(response);
});

// Create new item (Admin)
const createItem = asyncHandler(async (req, res) => {
	const { name, description, price, stock } = req.body;
	const item = await Item.create({ name, description, price, stock });

	const response = new ApiResponse(201, item, "Item created successfully");
	res.status(response.statusCode).json(response);
});

// Update item (Admin)
const updateItem = asyncHandler(async (req, res) => {
	const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!item) throw new ApiError("Item not found", 404);

	const response = new ApiResponse(200, item, "Item updated successfully");
	res.status(response.statusCode).json(response);
});

module.exports = { getItems, createItem, updateItem };
