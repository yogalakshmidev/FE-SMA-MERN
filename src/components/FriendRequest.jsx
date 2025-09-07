import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { updateFollowing } from "../store/user-slice";

const FriendRequest = ({ friend, removeFriend, addFriendBack }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.currentUser?.token);

  // Accept (follow)
  const handleAccept = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${friend._id}/follow-unfollow`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      const updatedFollowing = res.data.currentUserFollowing || [];
      dispatch(updateFollowing(updatedFollowing));
      window.dispatchEvent(
        new CustomEvent("friend-followed", { detail: friend })
      );

      removeFriend(friend._id); // remove from suggestions
    } catch (err) {
      console.error(
        "Error following user:",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleDeny = () => removeFriend(friend._id);

  return (
    <article className="friendRequest">
      <div className="friendRequest__info">
        <Link to={`/users/${friend._id}`}>
          <img
            src={friend?.profilePhoto || "/default-avatar.png"}
            alt={friend?.fullName}
            className="friendRequest__avatar"
          />
        </Link>
        <div className="friendRequest__details">
          <Link to={`/users/${friend._id}`}>
            <h5>{friend?.fullName}</h5>
          </Link>
          <small>{friend?.email}</small>
        </div>
      </div>
      <div className="friendRequest__actions">
        <button
          className="friendRequest__actions-approve"
          onClick={handleAccept}
        >
          <FaCheck />
        </button>
        <button className="friendRequest__actions-cancel" onClick={handleDeny}>
          <IoMdClose />
        </button>
      </div>
    </article>
  );
};

export default FriendRequest;
