const isAuthenticated = (request, response, next) => {
    if(request.user)
    {
        request.id = request.user.id;
        return next();
    }
        return response
        .status(401)
        .json({ statusCode: 401 });
  }

module.exports = {
    isAuthenticated
}