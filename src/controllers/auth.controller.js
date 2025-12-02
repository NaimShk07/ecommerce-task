const User = require("../models/User.model.js");
const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const generateToken = require("../utils/generateToken.js");

// Register
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, role } = req.body;

	const userExists = await User.findOne({ email });
	if (userExists) throw new ApiError("User already exists", 400);

	const user = await User.create({ name, email, password, role });

	const response = new ApiResponse(
		201,
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id, user.role),
		},
		"User registered successfully"
	);

	res.status(response.statusCode).json(response);
});

// Login
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user || !(await user.matchPassword(password))) {
		throw new ApiError("Invalid email or password", 401);
	}

	const response = new ApiResponse(
		200,
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id, user.role),
		},
		"Login successful"
	);

	res.status(response.statusCode).json(response);
});

module.exports = { registerUser, loginUser };
