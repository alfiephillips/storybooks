const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");

// Load config

dotenv.config({ path: "./config/config.env" });

// Connect Database

connectDB();

// Initialize app

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars

app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//Routes
app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 5000;

// Listen for requests

app.listen(PORT, (HOST) => {
  console.log(
    `Server starting on ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
