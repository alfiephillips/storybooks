const express = require("express");
const router = express.Router();
const passport = require("passport");
const dotenv = require('dotenv');
const findOrCreate = require('mongoose');
const GithubUser = require('../models/GitHubUser');
//@desc Github Authentication
const GitHubStrategy = require('passport-github2');
const GitHubUser = require("../models/GitHubUser");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "a5dc50ed2f7fc2a86e38",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "1cd93482904583cf8d89b88125731d7bb609f89c",
      callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        githubId: profile.id,
        username: profile.username,
        fullName: profile.displayName,
        photo: "/"
      };
      try {
        let user = await GitHubUser.findOne({ githubId: profile.id });

          if (user) {
            console.log(newUser);
            done(null, user);
          } else {
            console.log(newUser)
            user = await GitHubUser.create(newUser);
            done(null, user);
          }
      } catch(err){
        console.log(err);
      }
    }
  )
)

// @desc Authenticate with Google
// @route GET /auth/google

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc Authenticate with Github
// @route GET /auth/github

router.get("/github", passport.authenticate("github", { scope: ["Profile"] }));

// @desc Callback for Google Authentication
// @route GET /auth/google/callback

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
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
