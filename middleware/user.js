const { verify } = require("jsonwebtoken");

function validateUser(request, response, next) {
  const token = request.header("token");
  if (!token)
    return response.json({
      error: "TokenError",
      message: "Please add Token in headers",
    });
  try {
    const user = verify(token, process.env.SECRET);
    request.id = user.id;
    next();
  } catch (error) {
    return response.json({
      error: "AuthenticationError",
      message: "Please Authenticate using valid Token",
    });
  }
}

module.exports = {
  validateUser,
};
