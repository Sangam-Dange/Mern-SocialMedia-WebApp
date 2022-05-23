import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import "./UpdatePassword.css";
import { useAlert } from "react-alert";
import { updatePasswordUser } from "../../Actions/User";

const UpdatePassword = () => {
  const { error,loading,message } = useSelector((state) => state.like);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert,error,message]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updatePasswordUser(oldPassword,newPassword))
  };

  return (
    <div className="updatePassword">
      <form className="updatePasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          D Social
        </Typography>
        <input
          type="password"
          className="updatePasswordInputs"
          placeholder="Old Password"
          required
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          className="updatePasswordInputs"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button  type="submit">Change Password</Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
