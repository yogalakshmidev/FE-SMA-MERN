import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import TimeAgo from "timeago-react";
import axios from "axios";
import LikeDislikePost from "./LikeDislikePost";
import { FaRegCommentDots } from "react-icons/fa";
import {IoMdShare} from 'react-icons/io'
import TrimText from "../helpers/TrimText";
import BookmarksPost from "./BookmarksPost";
import { uiSliceActions } from "../store/ui-slice";

const Feed = ({ post,onDeletePost }) => {
  const [creator, setCreator] = useState({});
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const [showFeedHeaderMenu,setShowFeedHeaderMenu] = useState(true);
  const dispatch = useDispatch()
  const location = useLocation()


  // Get post creator
  const getPostCreator = async () => {
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${post?.creator}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log("get post in creator is", response?.data.user);
      setCreator(response?.data.user);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getPostCreator();
  }, []);

  const closeFeedHeaderMenu = () =>{
    setShowFeedHeaderMenu(false)
  }

const showEditPostModal = () => {
  dispatch(uiSliceActions?.openEditProfileModal(post?._id))
  closeFeedHeaderMenu()
}

const deletePost = () => {
   onDeletePost(post?._id)
   closeFeedHeaderMenu()
}


  return (
    <article className="feed">
      <header className="feed__header">
        <Link to={`/users/${post?.creator}`} className="feed__header-profile">
          <ProfileImage image={creator?.profilePhoto} />
          <div className="feed__header-details">
            <h4>{creator?.fullName}</h4>
            <small>
              {" "}
              <TimeAgo date={post?.createdAt} />
            </small>
          </div>
        </Link>
{showFeedHeaderMenu && userId == post?.creator && location.pathname.includes("users") && <menu className="feed__headermenu">
  <button onClick={showEditPostModal}>Edit</button>
  <button onClick={deletePost}>Delete</button>

  </menu>}

      </header>

      <Link to={`posts/${post?._id}`} className="feed__body">
      <p><TrimText item = {post?.body} maxLength={30}/></p>
      <div className="feed__images">
        <img src={post?.image} alt=""/>
      </div>
      </Link>
<footer className="feed__footer">
  <div>
    <LikeDislikePost post={post} />
    <button className="feed__footer-comments">
      <Link to={`/posts/${post?._id}`}><FaRegCommentDots/></Link>
      <small>{post?.comments?.length}</small>
    </button>
    <button className="feed__footer-share"><IoMdShare /></button>
  </div>
<BookmarksPost post={post} />

</footer>

    </article>
  );
};

export default Feed;
