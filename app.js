const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const chalk = require("chalk");
const clear = require("clear-console");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');

// Load config

dotenv.config({ path: "config.env" });

// Passport config

require("./config/passport")(passport);

// Connect Database

connectDB();

// Initialize app

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Handlebars Helpers
const { 
  formatDate,
  stripTags,
  truncate,
  editIcon
} = require('./helpers/hbs');

// Handlebars

app.engine(".hbs", exphbs({ helpers: {
  formatDate,
  stripTags,
  truncate,
  editIcon
}, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Sessions

app.use(
  cookieSession({
    name: 'session',
    secret: process.env.SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware

app.use(passport.initialize());
app.use(passport.session());

// Set global variables

app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  next()
})

// Static Folder

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;
// Listen for requests

const startup = () => {
  console.log(chalk.cyan.bgBlack.underline(`\nPORT: ${PORT}\n`));
  console.log(chalk.red.bgBlack.underline(`MODE: ${process.env.NODE_ENV}\n`));
  console.log(chalk.yellow.bgBlack.underline(`URL: ${HOST}:${PORT}\n`));
};

app.listen(PORT, () => {
  clear(true);
  console.log(chalk.black.bgWhite.bold("SERVER IS STARTING...\n"));
  setTimeout(() => {
    startup();
  }, 2000);
});
