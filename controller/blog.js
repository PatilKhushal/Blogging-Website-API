const { validationResult } = require("express-validator");
const { blogModel } = require("../model/blog");
const { getDate } = require("../service/getDate");
const fs = require("fs/promises");
const { commentModel } = require("../model/comment");
const { userModel } = require("../model/user");

async function handleGetAllBlogs(request, response) {
  const token = request.cookies?.token;
  let blogs = await blogModel
    .find({isPublic : true})
    .populate({ path: "author", select: "_id name email" })
    .populate({ path: "comments" });
  if (!token)
    blogs = blogs.map((data) => {
      return { ...data._doc, content: null };
    });

  return response
    .status(200)
    .json({ statusCode: 200, blogs: blogs, totalBlogs: blogs.length });
}

async function handleGetSpecificBlog(request, response) {
  try {
    const blogs = await blogModel
      .findOne({ _id: request.params.id })
      .populate({ path: "author", select: "_id name email" })
      .populate({ path: "comments" });
    if (!blogs)
      return response
        .status(400)
        .json({ statusCode: 400, error: "No such blog present" });
    return response.status(200).json({ statusCode: 200, blog: blogs });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ statusCode: 500, error: "Internal Server Error" });
  }
}

async function handleGetUserBlogs(request, response) {
  const blogs = await blogModel.find({ author: request.id });
  return response.status(200).json({ statusCode: 200, blogs });
}

const handlePostComment = async (request, response) => {
  let validation = validationResult(request);
  if (!validation.isEmpty())
    return response
      .status(400)
      .json({ statusCode: 400, error: validation.array() });
  try {
    const blog = await blogModel.findOne({ _id: request.params.id });
    if (!blog)
      return response
        .status(400)
        .json({ statusCode: 400, error: "No such blog present" });

    const comment = await commentModel.create(request.body);
    await comment.save();

    blog.comments.push(comment);
    blog.totalComments++;
    await blog.save();

    const user = await userModel.findById(request.id);
    user.comments.push(comment);
    await user.save();

    return response.status(200).json({ statusCode: 200, blog: blog });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ statusCode: 500, error: "Internal Server Error" });
  }
};

const handleDeleteComment = async (request, response) => {
  let validation = validationResult(request);
  if (!validation.isEmpty())
    return response
      .status(400)
      .json({ statusCode: 400, error: validation.array() });

  const user = await userModel.findById(request.id);
  if (!user.comments.includes(request.body.id))
    return response
      .status(400)
      .json({ statusCode: 400, error: "can't delete others comment" });

  user.comments = user.comments.filter((data) => data != request.body.id);
  await user.save();
  const comment = await commentModel.findByIdAndDelete(request.body.id);
  if (!comment)
    return response
      .status(400)
      .json({ statusCode: 400, error: "No such CommentID Present" });

  const blog = await blogModel.findById(request.params.id);
  blog.comments = blog.comments.filter((data) => data != request.body.id);
  blog.totalComments--;
  await blog.save();

  return response.status(200).json({ statusCode: 200 });
};

const handleLikeBlog = async (request, response) => {
  try {
    const blogs = await blogModel.findById({ _id: request.params.id });
    if (!blogs)
      return response
        .status(400)
        .json({ statusCode: 400, error: "No such blog present" });

    const user = await userModel.findById(request.id);
    if (!user)
      return response
        .status(400)
        .json({ statusCode: 400, error: "User Error" });

    let increment = 1;
    if (user.likedBlogs.includes(request.params.id))
    {
      user.likedBlogs = user.likedBlogs.filter((data) => data != request.params.id);
      blogs.likes = blogs.likes.filter((data) => data != request.id);
      increment = -1;
    }
    else
    {
      user.likedBlogs.push(request.params.id);
      blogs.likes.push(request.id);
    }
    await user.save();

    blogs.totalLikes += increment;
    await blogs.save();

    return response.status(200).json({ statusCode: 200, blog: blogs });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ statusCode: 500, error: "Internal Server Error" });
  }
}

const handleLikeComment = async (request, response) => {
  try
  {
    const blog = await blogModel.findById(request.params.id);
    if(!blog)
      return response.status(400).json({statusCode : 400, error : "No such Blog"});

    const comment = await commentModel.findById(request.params.commentId);
    if(!comment)
      return response.status(400).json({statusCode : 400, error : "No such Comment"});

    const user = await userModel.findById(request.id);
    if(!user)
      return response.status(400).json({statusCode : 400, error : "No such User"});

    if(user.likedComments.includes(request.params.commentId))
    {
        user.likedComments = user.likedComments.filter((data) => data != request.params.commentId)
        comment.likes = comment.likes.filter((data) => data != request.id)
    }
    else
    {
      user.likedComments.push(request.params.commentId);
      comment.likes.push(request.id);
    }

    await user.save();
    await comment.save();
  }
  catch(error)
  {
    console.log(error);
    return response.status(500).json({statusCode : 500, error : "Internal Server Error"});
  }
}
module.exports = {
  handleGetAllBlogs,
  handleGetUserBlogs,
  handleGetSpecificBlog,
  handlePostComment,
  handleDeleteComment,
  handleLikeBlog,
  handleLikeComment
};
