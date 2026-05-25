const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;