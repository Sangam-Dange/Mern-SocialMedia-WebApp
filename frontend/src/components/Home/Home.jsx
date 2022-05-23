import React, { useEffect } from "react";
import Post from "../Post/Post";
import User from "../User/User";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import { getAllUsers, getFollowingPosts } from "../../Actions/User.js";
import { Typography } from "@mui/material";
import { useAlert } from "react-alert";

const Home = () => {
  const dispatch = useDispatch();
  const { error: likeError, message } = useSelector((state) => state.like);
  const { loading, posts } = useSelector(
    (state) => state.postOfFollowing
  );
  const { loading: usersLoading, users } = useSelector(
    (state) => state.allUsers
  );
  const alert = useAlert();
  useEffect(() => {
    dispatch(getFollowingPosts());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (likeError) {
      alert.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, likeError, message, dispatch]);

  return loading === true || usersLoading === true ? (
    <Loader />
  ) : (
    <div className="home">
      <div className="homeleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postImage={post.image.url}
              caption={post.caption}
              postId={post._id}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
            />
          ))
        ) : (
          <Typography variant="h6">No posts yet</Typography>
        )}
      </div>
      <div className="homeright">
        {users && users.length > 0 ? (
          users.map((user) => (
            <User
              key={user._id}
              userId={user._id}
              name={user.name}
              avatar={user.avatar.url}
            />
          ))
        ) : (
          <Typography>No Users Yet</Typography>
        )}
      </div>
    </div>
  );
};

export default Home;
