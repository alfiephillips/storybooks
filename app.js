const express = require("express");
const dotenv = require("dotenv");

// Load config

dotenv.config({ path: "./config/config.env" });

// Initialize app

const app = express();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

// Listen for requests

app.listen(PORT, (HOST) => {
  console.log(`Server starting on ${HOST}:${PORT}`);
});
