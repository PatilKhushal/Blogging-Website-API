const { checkSchema } = require("express-validator");
const {
  handleGetAllBlogs,
  handleGetSpecificBlog,
  handlePostComment,
  handleDeleteComment,
  handleLikeBlog,
  handleLikeComment
} = require("../../controller/blog");
const { validateUser } = require("../../middleware/user");

const router = require("express").Router();
/* router.use('/user', validateUser, handleUserSpecific) */


const commentValidation = checkSchema({
  data: {
    in: ["body"],
    exists: { errorMessage: "comment must be present" },
    notEmpty: { errorMessage: "comment can't be empty" },
    isString: true,
  },
});

const deleteCommentValidation = checkSchema({
  id: {
    in: ["body"],
    exists: { errorMessage: "comment id must be present" },
    notEmpty: { errorMessage: "comment id can't be empty" },
    isString: true,
  },
});

router.get("/", handleGetAllBlogs);

router.use("/:id", validateUser);
router.get("/:id", handleGetSpecificBlog);
router.put("/:id/like", handleLikeBlog);

router.post("/:id/comment", commentValidation, handlePostComment);
router.put("/:id/:commentId/like", handleLikeComment)
router.delete("/:id/comment", deleteCommentValidation, handleDeleteComment);

module.exports = router;
