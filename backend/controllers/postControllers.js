const postModel = require("../models/postsModel");
const userModel = require("../models/userModel");
const cloudinary = require("cloudinary");

exports.createPost = async (req, res) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "posts",
    });

    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: req.user._id,
    };

    const newPost = await postModel.create(newPostData);

    const user = await userModel.findById(req.user._id);

    //! push add element in last
    //?* user.posts.push(newPost._id);

    //! unshift add element in the start
    user.posts.unshift(newPost._id);
    await user.save();
    
    res.status(201).json({
      success: true,
      post: newPost,
      message: "Post Created ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user._id;
    const post = await postModel.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.owner.toString() !== currentUser.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized action" });
    }

    await cloudinary.v2.uploader.destroy(post.image.public_id)

    await post.remove();

    //*after deleting post we are also removing post id from user.posts
    const user = await userModel.findById(currentUser);
    const index = user.posts.indexOf(id);
    user.posts.splice(index, 1);
    


    await user.save();

    // user.posts.filter((post) => post.toString() !== id);

    // await user.save();

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.likeAndUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user._id;
    const post = await postModel.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.likes.includes(currentUser)) {
      const index = post.likes.indexOf(currentUser);

      post.likes.splice(index, 1);

      await post.save();
      return res.status(200).json({ success: true, message: "Post Unliked" });
    } else {
      post.likes.push(currentUser);
      await post.save();
      return res.status(200).json({ success: true, message: "Post Liked" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getting all the post of users that we are following
//i.e
exports.getPostOfFollowing = async (req, res) => {
  try {
    const currentUser = req.user._id;

    //*?first method ------------------------------------------------------------
    //* we are populating posts of the users those we after following by using .populate method
    //* we have id inside our following tab
    //* so .populate("following") will populate those users inside our following whose id's are inside our following
    //* and .populate("following","posts") will populate only posts of those particular user whose id are inside our following tab

    // const user = await userModel
    //   .findById(currentUser)
    //   .populate("following", "posts");

    // res.status(200).json({ success: true, following: user.following });

    //*? second method (best way)------------------------------------------------------------
    //* here we are scanning through all the posts inside our postModel
    //* then inside user.following we have id's of all the users to those we are following
    //* now to postsModel we are passing user.following which is an array of id's
    //* now we are checking  inside every post owner key and matching it with all user id's inside our following
    //* if it matches then it will give that user,s post and thus
    //* inside posts we are getting all the posts of the user's that we are following
    //! as we can see $in is operator in mongodb which will take all elements one by one in users.following
    //! as it is an array so we will compare  each element with owner(idi.e postCreator )

    const user = await userModel.findById(currentUser);

    const posts = await postModel
      .find({
        owner: {
          $in: user.following,
        },
      })
      .populate("owner likes comments.user");

    res.status(200).json({ success: true, posts: posts.reverse() });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCaption = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const { caption } = req.body;
    const { id } = req.params;
    const post = await postModel.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== currentUser.toString()) {
      res.status(401).json({
        success: false,
        message: "Unauthorized action",
      });
    } else {
      if (!caption) {
        res.status(400).json({
          success: false,
          message: "please enter a valid caption",
        });
      } else {
        post.caption = caption;

        await post.save();

        res.status(200).json({
          success: true,
          message: "Caption updated successfully",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addComments = async (req, res) => {
  try {
    const { comment } = req.body;
    const currentUser = req.user._id;
    const { id } = req.params;

    const post = await postModel.findById(id);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    let commentIndex = -1;

    //! checking if comment already exist
    post.comments.forEach(({ user, comment }, index) => {
      if (user.toString() === currentUser.toString()) {
        commentIndex = index;
      }
    });

    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = comment;

      await post.save();

      res.status(200).json({
        success: true,
        message: "comment updated",
      });
    } else {
      post.comments.push({ user: currentUser, comment: comment });

      await post.save();

      res.status(200).json({
        success: true,
        message: "comment added",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//!for refreshing likes on the frontend
exports.getAllLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id).populate("likes");
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//!for refreshing comments on the frontend
exports.getAllComments = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id).populate("comments.user");
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const { id } = req.params;

    const post = await postModel.findById(id);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
 
    //* checking if owner wants to delete

    if (post.owner.toString() === currentUser.toString()) {
      if (req.body.commentId === undefined) {
        res.status(400).json({
          success: false,
          message: "comment Id is required",
        });
      }

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });
 
      await post.save();

      res.status(200).json({
        success: true,
        message: "selected comment has deleted successfully",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === currentUser.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      res.status(200).json({
        success: true,
        message: "your comment has deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
