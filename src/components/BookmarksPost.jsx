import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
const BookmarksPost = ({ post, onBookmarkChange }) => {
  const [postBookmarked, setPostBookmarked] = useState(false);

  const currentUser = useSelector((state) => state?.user?.currentUser);
  const userId = currentUser?._id || currentUser?.id;
  const token = currentUser?.token?.accessToken || currentUser?.token; 

  useEffect(() => {
    const checkBookmark = async () => {
      if (!token || !userId || !post?._id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const bookmarks = res?.data?.user?.bookmarks || [];
        setPostBookmarked(bookmarks.includes(post?._id));
      } catch (err) {
        console.log("Bookmark check error:", err.response?.data || err.message);
      }
    };
    checkBookmark();
  }, [post?._id, userId, token]);

  const toggleBookmark = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const bookmarks = res?.data?.bookmarks || [];
      const isBookmarked = bookmarks.includes(post?._id);
      setPostBookmarked(isBookmarked);
      alert('bookmark clicked')

      
      if (onBookmarkChange) {
        onBookmarkChange(post._id, isBookmarked);
      }
    } catch (err) {
      console.log("Bookmark toggle error:", err.response?.data || err.message);
    }
  };

  return (
    <button className="feed__footer-bookmark" onClick={toggleBookmark}>
      {postBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default BookmarksPost;
