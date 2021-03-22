const express = require("express");
const router = express.Router();
const passport = require("passport");

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

module.exports = router;
