const { checkSchema, validationResult } = require("express-validator");
const { userModel } = require("../../model/user");
const router = require("express").Router();
const express = require("express");
const { upload } = require("../../service/uploadFile");
const { blogModel } = require("../../model/blog");
const fsPromise = require("fs/promises");


router.get("/profile", async (request, response) => {
  const user = await userModel
    .findById(request.id)
    .populate({path : "blogs", select : '-__v -author'})
    .populate("likedBlogs")
    .populate({path : "comments", select : '-__v'})
    .populate("likedComments");
  if (!user)
    return response.status(400).json({ statusCode: 400, error: "No User" });

  return response.status(200).json({ statusCode: 200, user: user });
});

const changePasswordValidation = checkSchema({
  oldPassword: {
    in: "body",
    exists: { errorMessage: "Old Password must be present" },
    isString: true,
    notEmpty: {
      errorMessage: "Old Password can't be empty",
    },
  },
  newPassword: {
    in: "body",
    exists: { errorMessage: "New Password must be present" },
    isString: true,
    notEmpty: {
      errorMessage: "New Password can't be empty",
    },
  },
});

const blogValidation = checkSchema({
  content: {
    in: ["body"],
    exists: { errorMessage: "Data must be present" },
    isString: true,
  },
  title: {
    in: ["body"],
    exists: { errorMessage: "Title must be present" },
    notEmpty: {
      errorMessage: "Title can't be empty",
    },
    isString: true,
  },
});

router.put(
  "/profile/change-password",
  changePasswordValidation,
  async (request, response) => {
    const validation = validationResult(request);
    if (!validation.isEmpty())
      return response
        .status(400)
        .json({ statusCode: 400, error: validation.array() });
    const user = await userModel.findById(request.id);
    if (!user)
      return response.status(400).json({ statusCode: 400, error: "No User" });

    const { oldPassword, newPassword } = request.body;
    const result = await userModel.isValidCredentials({
      email: user.email,
      password: oldPassword,
    });
    if (!result)
      return response
        .status(400)
        .json({ statusCode: 400, error: "Incorrect Old Password" });

    user.password = newPassword;
    await user.save();
    return response.status(200).json({ statusCode: 200 });
  }
);

router.post(
  "/blogs",
  upload.single("thumbnail"),
  blogValidation,
  express.static("public"),
  async (request, response) => {
    let validation = validationResult(request);
    if (!validation.isEmpty()) {
      await fsPromise.unlink(`public/${request.id.substring(request.user.id.indexOf('|') + 1).trim()}/${request.file.filename}`);
      return response
        .status(400)
        .json({ statusCode: 400, error: validation.array() });
    }

    try {
    const user = await userModel.findById(request.id);
      if(!user)
        return response.status(400).json({statusCode : 400, error : "No User"});
      /* if(!request.file)
              return response.status(400).json({ statusCode : 400, error: "Thumbnail must be present" }); */

      const blog = await blogModel.create({
        ...request.body,
        author: request.id,
        thumbnail : `http://localhost:3000/${request.id}/${request.file.filename}`
      });
      
      await blog.save();

      user.blogs.push(blog._id);
      await user.save();
      
      return response.status(200).json({ statusCode: 200 });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ statusCode: 500, error: "Internal Server Error" });
    }
  }
);

router.get(
  "/blogs",
  async (request, response) => {
    try {
    const user = await userModel.findById(request.id);
      if(!user)
        return response.status(400).json({statusCode : 400, error : "No User"});
        
        const blogs = await blogModel.find({author : request.id}).sort({date : -1}).select('-author -comments -likes -__v')

      return response.status(200).json({ statusCode: 200, blogs : blogs, totalBlogs : blogs.length});
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ statusCode: 500, error: "Internal Server Error" });
    }
  }
);

router.get('/blogs/:id', async (request, response) => {
    try {
        const user = await userModel.findById(request.id);
        if(!user)
            return response.status(400).json({statusCode : 400, error : "No User"})
        
        const blogs = await blogModel
          .findOne({ _id: request.params.id, author : request.id }).select('-author -isPublic -__v')
          .populate({ path: "comments", select : '-__v' });
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
})

router.delete('/blogs/:id', async (request, response) => {
    try {
        const user = await userModel.findById(request.id);
        if(!user)
            return response.status(400).json({statusCode : 400, error : "No User"})
        
        const blogs = await blogModel
          .findOneAndDelete({ _id: request.params.id, author : request.id })
        if (!blogs)
          return response
            .status(400)
            .json({ statusCode: 400, error: "No such blog present" });

        return response.status(200).json({ statusCode: 200});
      } catch (error) {
        console.log(error);
        return response
          .status(500)
          .json({ statusCode: 500, error: "Internal Server Error" });
      }
})
module.exports = router;
