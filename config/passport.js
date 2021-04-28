const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require('passport-github2').Strategy
const mongoose = require("mongoose");
const GoogleUser = require('../models/GoogleUser')
const GithubUser = require('../models/GitHubUser');


module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          let user = await GoogleUser.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await GoogleUser.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    GoogleUser.findById(id, (err, user) => done(err, user));
  });
},
function(passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          githubId: profile.id,
          username: profile.username,
          fullName: profile.displayName,
          photo: profile.image,
        };
        try {
          let user = await GithubUser.findOne({ githubId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await GithubUser.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    GithubUser.findById(id, (err, user) => done(err, user));
  });
}