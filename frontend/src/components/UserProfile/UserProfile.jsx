import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { followAndUnfollowUser, getUsersPosts } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "../Account/Account.css";
import axios from "axios";

const UserProfile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);
  const {
    posts: newUserPosts,
    loading,
    error,
  } = useSelector((state) => state.userPosts);
  const {
    error: followError,
    message,
    loading: followLoading,
  } = useSelector((state) => state.like);
  const [currUserPost, setCurrentUserPost] = useState([]);
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const alert = useAlert();

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/userposts/${params.id}`);

      setCurrentUserPost(data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getUsersPosts(params.id));
    fetchPosts();
  }, [dispatch, params.id]);

  useEffect(() => {
    if (followError) {
      alert.error(followError);
      dispatch({ type: "clearErrors" });
    }
    if (userError) {
      alert.error(userError);
      dispatch({ type: "clearErrors" });
    }
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, followError, message, dispatch, userError, error]);

  useEffect(() => {
    if (user._id === params.id) {
      setMyProfile(true);
    }

    if (newUserPosts) {
      newUserPosts.followers.forEach((item) => {
        if (item._id === user._id) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
  }, [user, params.id, newUserPosts, location]);

  const followHandler = async () => {
    setFollowing(!following);
    await dispatch(followAndUnfollowUser(params.id));
    dispatch(getUsersPosts(params.id));
    fetchPosts();
  };

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {currUserPost && currUserPost.length > 0 ? (
          currUserPost.map((post) => (
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
          <Typography variant="h6">User has not made any post yet</Typography>
        )}
      </div>

      <div className="accountright">
        <Avatar
          src={newUserPosts?.avatar.url}
          sx={{ height: "8vmax", width: "8vmax" }}
        />
        <Typography variant="h5">{newUserPosts?.name}</Typography>
        <div>
          <button onClick={() => setFollowersToggle(!followersToggle)}>
            <Typography>Followers</Typography>
          </button>
          <Typography>{newUserPosts?.followers.length}</Typography>
        </div>
        <div>
          <button onClick={() => setFollowingToggle(!followingToggle)}>
            <Typography>Following</Typography>
          </button>
          <Typography>{newUserPosts?.following.length}</Typography>
        </div>
        <div>
          <Typography>Post</Typography>
          <Typography>{newUserPosts?.posts.length}</Typography>
        </div>

        {myProfile ? null : (
          <Button
            variant="contained"
            onClick={followHandler}
            disabled={error}
            style={{ backgroundColor: following ? "red" : "" }}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}

        <Dialog
          open={followersToggle}
          onClose={() => setFollowersToggle(!followersToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers </Typography>
            {newUserPosts && newUserPosts.followers.length > 0 ? (
              newUserPosts.followers.map((follower) => {
                return (
                  <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={follower.avatar.url}
                  />
                );
              })
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                You have no Followers
              </Typography>
            )}
          </div>
        </Dialog>

        <Dialog
          open={followingToggle}
          onClose={() => setFollowingToggle(!followingToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Following </Typography>
            {newUserPosts && newUserPosts.following.length > 0 ? (
              newUserPosts.following.map((following) => {
                return (
                  <User
                    key={following._id}
                    userId={following._id}
                    name={following.name}
                    avatar={following.avatar.url}
                  />
                );
              })
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                You are not Following anyone
              </Typography>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
