import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import FriendRequest from "./FriendRequest";

const FriendRequests = () => {
  const [friends, setFriends] = useState([]);
  const token = useSelector((state) => state.user.currentUser?.token);
  const currentUser = useSelector((state) => state.user.currentUser);

  // fetch suggestions
  const getFriends = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const allUsers = res.data.users || [];
      setFriends(allUsers);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data?.message || err.message);
    }
  }, [token, currentUser]);

  useEffect(() => {
    getFriends();
  }, [getFriends, currentUser?.following]);

  // remove from list
  const removeFriend = (id) => {
    setFriends((prev) => prev.filter((f) => f._id !== id));
  };

  // re-add into list (when unfollowed)
  const addFriendBack = (friend) => {
    setFriends((prev) => {
      if (prev.some((f) => f._id === friend._id)) return prev;
      return [...prev, friend];
    });
  };


  useEffect(() => {
  const handleUnfollow = (e) => addFriendBack(e.detail);
  const handleFollow = (e) => removeFriend(e.detail._id);

  window.addEventListener("friend-unfollowed", handleUnfollow);
  window.addEventListener("friend-followed", handleFollow);

  return () => {
    window.removeEventListener("friend-unfollowed", handleUnfollow);
    window.removeEventListener("friend-followed", handleFollow);
  };
}, []);


  return (
    <menu className="friendRequests">
      <h3>Suggested Friends</h3>
      {friends.length === 0 ? (
        <p>No suggestions right now</p>
      ) : (
        friends.map((friend) => (
          <FriendRequest
            key={friend._id}
            friend={friend}
            removeFriend={removeFriend}
            addFriendBack={addFriendBack}
          />
        ))
      )}
    </menu>
  );
};

export default FriendRequests;
