const Joi = require("joi");

// Registration validation
const registerValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(50).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
		role: Joi.string().valid("User", "Admin").optional(),
	});
	return schema.validate(data);
};

// Login validation
const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
