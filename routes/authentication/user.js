const { checkSchema } = require("express-validator");
const { handleUserSignup, handleUserLogin } = require("../../controller/user");

// importing
const router = require("express").Router();

const signUpValidation = checkSchema({
  name: {
    in: ["body"],
    exists: { errorMessage: "Name must be present" },
    trim: true, 
    notEmpty : {
        errorMessage : "Name can't be empty"
    },
    isString: true,
    isLength: {
      options: {
        max: 30,
      },
      errorMessage: "Name can be only 30 characters long",
    },
  },
  email: {
    in: ["body"],
    exists: { errorMessage: "Email must be present" },
    notEmpty : {
        errorMessage : "Email can't be empty"
    },
    isEmail: true
  },
  password: {
    in: ["body"],
    exists: { errorMessage: "Password must be present" },
    notEmpty : {
        errorMessage : "Password can't be empty"
    },
    isString : true
  },
  joiningDate : {
    in: ["body"],
    exists: { errorMessage: "Joining Date must be present" },
    notEmpty : {
        errorMessage : "Date can't be empty"
    },
    isDate : true
  }
});

const loginValidation = checkSchema({
  email: {
    in: ["body"],
    exists: { errorMessage: "Email must be present" },
    notEmpty : {
        errorMessage : "Email can't be empty"
    },
    isEmail: true
  },
  password: {
    in: ["body"],
    exists: { errorMessage: "Password must be present" },
    notEmpty : {
        errorMessage : "Password can't be empty"
    },
    isString : true
  },
});



router.post("/signup", signUpValidation, handleUserSignup);
router.post("/login", loginValidation, handleUserLogin);

module.exports = router;
