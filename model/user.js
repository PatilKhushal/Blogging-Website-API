const { genSalt, hash, compare } = require("bcrypt");
const mongoose = require("mongoose");
const { getDate } = require("../service/getDate");
const rounds = 10;

/************************************************************** User Schema **************************************************************/

// Schema for Users
const userSchema = mongoose.Schema({
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

  password: {
    required: true,
    type: String,
  },

  salt: {
    type: String,
  },

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

// Defining a pre hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.salt = await genSalt(rounds);
  this.password = await hash(this.password, this.salt) + process.env.pepper;
  next();
});

// Defining a static function to validate Login credentials
userSchema.statics.isValidCredentials = async function({email, password}) {
  const user = await this.findOne({email});
  if(!user)
    throw new Error('No User Found');

  return (await compare(password, user.password.split(process.env.pepper)[0])) ? user : null;
}

// Model for Users
const userModel = mongoose.model("users", userSchema);

module.exports = {
  userModel,
};
