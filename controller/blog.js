const { blogModel } = require("../model/user");

async function handleGetAllBlogs(request, response)
{
    const blogs = await blogModel.find({});
    return response.json(blogs);
}

async function handleGetUserBlogs(request, response)
{
    const blogs = await blogModel.find({author : request.id});
    return response.json({blogs});
}

module.exports = {
    handleGetAllBlogs,
    handleGetUserBlogs
}