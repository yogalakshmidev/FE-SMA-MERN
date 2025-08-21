import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import TimeAgo from "react-timeago";
import axios from "axios";
import LikeDislikePost from "./LikeDislikePost";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import TrimText from "../helpers/TrimText";
import BookmarksPost from "./BookmarksPost";
import { uiSliceActions } from "../store/ui-slice";
import { HiDotsHorizontal } from "react-icons/hi";

const Feed = ({ post, onDeletePost }) => {
  const [creator, setCreator] = useState({});
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  // Determine image URL (backend or external)
  const getImageURL = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http")
      ? imagePath
      : `${import.meta.env.VITE_API_URL}/${imagePath}`;
  };

  // Get post creator details
  const getPostCreator = async () => {
    try {
      const creatorId =
        typeof post.creator === "object" ? post.creator._id : post.creator;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${creatorId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCreator(response?.data.user);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getPostCreator();
  }, []);

  const closeFeedHeaderMenu = () => {
    setShowFeedHeaderMenu(false);
  };

  const showEditPostModal = () => {
    dispatch(uiSliceActions?.openEditPostModal(post?._id));
    closeFeedHeaderMenu();
  };

  const deletePost = () => {
    onDeletePost(post?._id);
    closeFeedHeaderMenu();
  };

  const postImageURL = getImageURL(post?.image);
  const profileImageURL = getImageURL(creator?.profilePhoto);

  return (
    <article className="feed">
      <header className="feed__header">
        <Link
          to={`/users/${creator?._id || post?.creator}`}
          className="feed__header-profile"
        >
          <ProfileImage image={profileImageURL} />
          <div className="feed__header-details">
            <h4>{creator?.fullName}</h4>
            <small>
              {post?.createdAt && <TimeAgo date={post?.createdAt} />}
            </small>
          </div>
        </Link>

        {showFeedHeaderMenu &&
          userId === post?.creator &&
          location.pathname.includes("users") && (
            <menu className="feed__header-menu">
              <button onClick={showEditPostModal}>Edit</button>
              <button onClick={deletePost}>Delete</button>
            </menu>
          )}

        {userId === post?.creator && location.pathname.includes("users") && (
          <button onClick={() => setShowFeedHeaderMenu(!showFeedHeaderMenu)}>
            <HiDotsHorizontal />
          </button>
        )}
      </header>

      <Link to={`/posts/${post?._id}`} className="feed__body">
        <p>
          <TrimText item={post?.body} maxLength={30} />
        </p>
        {postImageURL && (
          <div className="feed__images">
            <img src={postImageURL} alt="Post" />
          </div>
        )}
      </Link>

      <footer className="feed__footer">
        <div>
          <LikeDislikePost post={post} />
          <button className="feed__footer-comments">
            <Link to={`/posts/${post?._id}`}>
              <FaRegCommentDots />
            </Link>
            <small>{post?.comments?.length}</small>
          </button>
          <button className="feed__footer-share">
            <IoMdShare />
          </button>
        </div>
        <BookmarksPost post={post} />
      </footer>
    </article>
  );
};

export default Feed;
