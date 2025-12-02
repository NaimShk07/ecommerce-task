const express = require("express");
const app = express();
const authRoutes = require("./routes/auth.route.js");
const itemRoutes = require("./routes/item.route.js");
const orderRoutes = require("./routes/order.route.js");
const errorHandler = require("./middleware/error.middlware.js");
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/users", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
	res.send("E-commerce API is running...");
});

app.use(errorHandler);

module.exports = app;
