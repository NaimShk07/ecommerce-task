const Joi = require("joi");

// Order creation validation
const createOrderValidation = (data) => {
	const schema = Joi.object({
		items: Joi.array()
			.items(
				Joi.object({
					item: Joi.string().length(24).required(), // MongoDB ObjectId
					quantity: Joi.number().integer().min(1).required(),
				})
			)
			.min(1)
			.required(),
	});
	return schema.validate(data);
};

// Status update validation
const updateStatusValidation = (data) => {
	const schema = Joi.object({
		status: Joi.string()
			.valid("Pending", "Shipped", "Delivered", "Cancelled")
			.required(),
	});
	return schema.validate(data);
};

module.exports = { createOrderValidation, updateStatusValidation };
