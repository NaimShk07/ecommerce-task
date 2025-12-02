const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
} = require("../controllers/auth.controller.js");
const {
	registerValidation,
	loginValidation,
} = require("../validations/auth.validation.js");
const validate = require("../middleware/validate.middleware.js");

router.post("/register", validate(registerValidation), registerUser);
router.post("/login", validate(loginValidation), loginUser);

module.exports = router;
