const { genSalt, hash, compare } = require("bcrypt");
const mongoose = require("mongoose");
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
    minLength: 8,
    maxLength: 16,
  },

  salt: {
    type: String,
  },

  blogData: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "blogData",
    },
  ],

  joiningDate: {
    type: Date,
    required: true,
  },
});

// Defining a pre hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

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
const userModel = mongoose.model("BlogUsers", userSchema);


/************************************************************** Blog Schema **************************************************************/

// Schema for Blogs
const blogSchema = mongoose.Schema({
  data: {
    type: String,
    required: true,
  },

  author: {
    type: mongoose.Schema.ObjectId,
    ref: "BlogUsers",
    maxLength: 20,
  },

  date: {
    type: Date,
    required: true,
  },

  title: {
    type: String,
    required: true,
    maxLength: 50,
  },
});

// Model for Blogs
const blogModel = mongoose.model("blogData", blogSchema);

module.exports = {
  userModel,
  blogModel,
};
