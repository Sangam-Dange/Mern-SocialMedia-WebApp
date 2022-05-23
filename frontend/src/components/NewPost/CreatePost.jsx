import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography } from "@mui/material";
import { createNewPost } from "../../Actions/Post";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { loadUser } from "../../Actions/User";

const CreatePost = () => {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const { loading, message, error } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onload = () => {
      //! 0 means initial
      //! 1 means processing
      //! 2 means processed
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createNewPost(caption, image));
    dispatch(loadUser());
    navigate("/account")
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, message, error, dispatch]);

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={handlePostSubmit}>
        <Typography>New Post</Typography>
        {image && <img src={image} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
