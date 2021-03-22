const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
// Load config

dotenv.config({ path: "./config/config.env" });

// Passport config

require("./config/passport")(passport);

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

// Sessions

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware

app.use(passport.initialize());
app.use(passport.session());

// Static Folder

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

// Listen for requests

app.listen(PORT, (HOST) => {
  console.log(
    `Server starting on ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
