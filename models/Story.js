const mongoose = require("mongoose");
const date = require('date-and-time');
const now = new Date();
const pattern = date.compile('ddd, MMM DD YYYY');
const story_creation_date = date.format(now, pattern); 

// Create Story Table

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: story_creation_date
  },
});

module.exports = mongoose.model("Story", StorySchema);
