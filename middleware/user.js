const { verify } = require("jsonwebtoken");

function validateUser(request, response, next) {
  const token = request.cookies?.token;
  if (!token)
    return response.status(400).json({
      statusCode : 400,
      error: "TokenError",
      message: "Please Login Again",
    });
  try {
    const user = verify(token, process.env.SECRET);
    request.id = user.id;
    next();
  } catch (error) {
    return response.status(400).json({
      statusCode : 400,
      error: "AuthenticationError",
      message: "Please Authenticate using valid Token",
    });
  }
}

module.exports = {
  validateUser,
};
