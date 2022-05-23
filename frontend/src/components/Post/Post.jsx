import { Avatar, Button, Typography, Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentOnPost,
  deletePost,
  likePost,
  updatePost,
} from "../../Actions/Post";
import {  getMyPosts, loadUser } from "../../Actions/User";
import User from "../User/User";
import CommentCard from "../CommentCard/CommentCard";
import axios from "axios";

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage = [],
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentToggle, setCommentToggle] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [captionToggle, setCaptionToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);

  const [allComments, setAllComments] = useState(comments);
  const [allLikes, setAllLikes] = useState(likes);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const commentRefreshFunc = async () => {
    try {
      const { data } = await axios.get(`/api/v1/comments/${postId}`);

      setAllComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const likeRefreshFunc = async () => {
    try {
      const { data } = await axios.get(`/api/v1/likes/${postId}`);

      setAllLikes(data.likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    setLiked(!liked);
    await dispatch(likePost(postId));

    // if (isAccount) {
    likeRefreshFunc();
    // } else {
    //   dispatch(getFollowingPosts());
    // }
  };

  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);

  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(addCommentOnPost(postId, commentValue));

    // if (isAccount) {
    commentRefreshFunc();
    // } else {
    //   dispatch(getFollowingPosts());
    // }
  };

  const updateCaptionHandler = async (e) => {
    e.preventDefault();

    await dispatch(updatePost(postId, captionValue));
    setCaptionToggle(!captionToggle);
    dispatch(getMyPosts());
  };

  const deletePostHandler = async (e) => {
    e.preventDefault();
    await dispatch(deletePost(postId));
    dispatch(getMyPosts());
    dispatch(loadUser())
  };

  return (
    <div className="post">
      <div className="postHeader"></div>
      <div className="postHeader">
        {isAccount && (
          <Button onClick={() => setCaptionToggle(!captionToggle)}>
            <MoreVert />
          </Button>
        )}
      </div>
      <img src={postImage} alt="post" onDoubleClick={handleLike} />
      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{ height: "3vmax", width: "3vmax" }}
        />
        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography
          fontWeight={100}
          color="rgba(0,0,0,0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>
      <button
        style={{
          backgroundColor: "white",
          border: "none",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={allLikes.length === 0 ? true : false}
      >
        <Typography>{allLikes.length} likes</Typography>
      </button>
      <div className="postFooter">
        <Button onClick={handleLike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </Button>
        <Button onClick={() => setCommentToggle(!commentToggle)}>
          <ChatBubbleOutline />
        </Button>
        {isDelete ? (
          <Button onClick={deletePostHandler}>
            <DeleteOutline />
          </Button>
        ) : null}
      </div>

      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="DialogBox">
          <Typography variant="h4">Liked By </Typography>
          {allLikes.map((like) => {
            return (
              <User
                key={like._id}
                userId={like._id}
                name={like.name}
                avatar={like.avatar.url}
              />
            );
          })}
        </div>
      </Dialog>

      <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle(!commentToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments</Typography>
          <form className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              name="comment"
              id="comment"
              placeholder="Comment Here...."
              required
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Add
            </Button>
          </form>
          {allComments.length > 0 && allComments ? (
            allComments.map((comment) => {
              return (
                <CommentCard
                  key={comment._id}
                  userId={comment.user._id}
                  name={comment.user.name}
                  avatar={comment.user.avatar.url}
                  comment={comment.comment}
                  commentId={comment._id}
                  postId={postId}
                  isAccount={isAccount}
                />
              );
            })
          ) : (
            <Typography>No comments yet</Typography>
          )}
        </div>
      </Dialog>

      <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Update Caption</Typography>
          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              name="comment"
              id="comment"
              placeholder="Caption Here...."
              required
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Post;
