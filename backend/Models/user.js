const mongoose = require("mongoose");
const { tagSchema } = require('./tag');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },

  picture: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    // required: true,
  },

  tags: [tagSchema], // Use the Tag schema here

  filter: {
    type: String,
  },

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;