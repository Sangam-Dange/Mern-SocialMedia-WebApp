const express = require("express");
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getPostOfFollowing,
  updateCaption,
  addComments,
  deleteComment,
  getAllComments,
  getAllLikes,
} = require("../controllers/postControllers");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);
// localhost:4000/api/v1/post/upload

router
  .route("/post/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .put(isAuthenticated, updateCaption)
  .delete(isAuthenticated, deletePost);

router.route("/posts").get(isAuthenticated, getPostOfFollowing);
router
  .route("/comment/:id")
  .put(isAuthenticated, addComments)
  .delete(isAuthenticated, deleteComment);

  //my routes
router.route("/comments/:id").get(isAuthenticated,getAllComments)  
router.route("/likes/:id").get(isAuthenticated,getAllLikes)  

module.exports = router;
