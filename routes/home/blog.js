const { handleGetAllBlogs } = require('../../controller/blog');
const handleUserSpecific = require('./user');

const router = require('express').Router();
router.use('/user', handleUserSpecific)

router.get('/', handleGetAllBlogs);

module.exports = router;