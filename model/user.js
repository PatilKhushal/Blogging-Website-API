const { genSalt, hash, compare } = require("bcrypt");
const mongoose = require("mongoose");
const { getDate } = require("../service/getDate");
const rounds = 10;

/************************************************************** User Schema **************************************************************/

// Schema for Users
const userSchema = mongoose.Schema({
  authID : {
    type : String,
    required : true,
    unique : true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },

  email: {
    required: true,
    type: String,
    unique: true,
  },

  /* password: {
    required: true,
    type: String,
  },

  salt: {
    type: String,
  }, */

  blogs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "blogs",
    },
  ],

  /* profile_photo : {
    type : String,
    required : true
  }, */

  likedBlogs : [
    {
      type : mongoose.Schema.ObjectId,
      ref : 'blogs'
    }
  ],

  comments : [
    {
      type : mongoose.Schema.ObjectId,
      ref : "comments"
    }
  ],

  likedComments : [
    {
      type : mongoose.Schema.ObjectId,
      ref : 'comments'
    }
  ],

  joiningDate: {
    type: Date,
    default : getDate
  },
});

// Model for Users
const userModel = mongoose.model("users", userSchema);

module.exports = {
  userModel,
};
