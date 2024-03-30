const { validationResult } = require("express-validator");
const { userModel } = require("../model/user");
const jwt = require("jsonwebtoken");
const { createFolder } = require("../service/FolderRelated");

const handleUserSignup = async (request, response) => {
  let validation = validationResult(request);
  if (!validation.isEmpty()) {
    return response
      .status(400)
      .json({ statusCode: 400, error: validation.array() });
  }

  let newUser = request.body;
  let user = await userModel.findOne({ email: newUser.email });
  if (user) {
    return response.status(400).json({
      statusCode: 400,
      error: "DuplicateEmail",
      message: `Email ${newUser.email} already exists`,
    });
  }

  newUser = await userModel.create(newUser);
  await createFolder(newUser._id);
  return response.status(200).json({ statusCode: 200 });
};

const handleUserLogin = async (request, response) => {
  let validation = validationResult(request);
  if (!validation.isEmpty()) {
    return response
      .status(400)
      .json({ statusCode: 400, error: validation.array() });
  }

  try {
    const user = await userModel.isValidCredentials(request.body);
    if (!user)
      return response.status(400).json({
        statusCode: 400,
        error: "PasswordError",
        message: "Entered password is Invalid",
      });

    const oneDayInMillis = 1000 * 60 * 60 * 24;
    return response
      .cookie(
        "token",
        jwt.sign({ id: user._id, email: user.email }, process.env.SECRET, {
          expiresIn: "7d",
        }),
        {
          httpOnly: true,
          secure: true,
          sameSite: true,
          path: "/",
          maxAge: oneDayInMillis * 7,
        }
      )
      .status(200)
      .json({ statusCode: 200 });
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      statusCode: 400,
      error: "NoUser",
      message: `Email ${request.body.email} doesn't exists`,
    });
  }
};

const handleUserLogout = async (request, response) => {
  return response.clearCookie('token').json({statusCode : 200});
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout
};
