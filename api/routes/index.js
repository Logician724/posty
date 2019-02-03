const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const postController = require('../controllers/post.controller');

//--------- AUTH ENDPOINTS -------------- //

router.post('/login', userController.login);
router.post('/signup', userController.signup);

//-------- END OF AUTH ENDPOINTS -------- //

//--------- POSTS ENDPOINTS --------------- //

router.get('/posts', postController.getAllPosts);
router.post('/posts', postController.addPost);

//--------- END OF POST ENDPOINTS --------- //

module.exports = router;
