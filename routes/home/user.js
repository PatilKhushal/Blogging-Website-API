const { handleGetUserBlogs } = require('../../controller/blog');

const router = require('express').Router();

router.get('/', handleGetUserBlogs)

module.exports = router