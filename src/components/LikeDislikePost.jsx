import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FcLike } from "react-icons/fc";

const LikeDislikePost = ({ post, onUpdatePost }) => {
  const [localPost, setLocalPost] = useState(post);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const [postLiked, setPostLiked] = useState(false);

  // handle like/unlike
  const handleLikeDislikePost = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${localPost?._id}/like`,{},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedPost = response?.data;
      setLocalPost(updatedPost);
      onUpdatePost?.(updatedPost); 
    } catch (error) {
      console.log(error);
    }
  };

  // check if user liked post
  useEffect(() => {
  setPostLiked(localPost?.likes?.includes(userId));
}, [localPost?.likes, userId]);


  return (
    <button className="feed__footer-comments" onClick={handleLikeDislikePost}>
      {postLiked ? <FcLike /> : <FaRegHeart />}
      <small>{localPost?.likes?.length}</small>
    </button>
  );
};

export default LikeDislikePost;
