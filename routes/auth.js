const express = require("express");
const router = express.Router();
const passport = require("passport");
const dotenv = require('dotenv');


// @desc Authenticate with Google
// @route GET /auth/google

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc Callback for Google Authentication
// @route GET /auth/google/callback

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);


// @desc Logout with Google Authentication
// @route /auth/logout

router.get("/logout", (req, res) => {
  if (req.user) {
    console.log(
      `Logout request from id: ${req.user.id} name: ${req.user.displayName}`
    );
    req.logout();
    res.redirect("/");
  } else {
    console.log(`Failed Logout request`);
    res.redirect("/");
  }
});

module.exports = router;
