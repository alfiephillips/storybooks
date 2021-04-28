const mongoose = require('mongoose');

const GithubUserSchema = new mongoose.Schema({
    githubId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    githubId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    }
  });


module.exports = mongoose.model("GitHubUser", GithubUserSchema)
  