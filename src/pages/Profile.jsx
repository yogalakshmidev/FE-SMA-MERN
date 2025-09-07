import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import HeaderInfo from "../components/HeaderInfo";
import Feed from "../components/Feed";
import EditPostModal from "../components/EditPostModal";
import EditProfileModal from "../components/EditProfileModal";
import { updateFollowing } from "../store/user-slice";

const Profile = () => {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { id: userId } = useParams();
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const currentUserId = useSelector((state) => state?.user?.currentUser?.id);

  const editPostModalOpen = useSelector(
    (state) => state?.ui?.editPostModalOpen
  );
  const editProfileModalOpen = useSelector(
    (state) => state?.ui?.editProfileModalOpen
  );

  const dispatch = useDispatch();

  // ------------------------------
  // Fetch user profile and posts
  // ------------------------------
  const getUserData = async () => {
    setIsLoading(true);
    try {
      // Get user info
      const userRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setUser(userRes.data.user);

      // Get user posts
      const postsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setUserPosts(postsRes.data.posts || []);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, [userId]);

  // ------------------------------
  // Follow / Unfollow logic
  // ------------------------------
  const handleFollowToggle = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/follow-unfollow`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // update the profile being viewed
      setUser((prev) => ({
        ...prev,
        followers: res.data.updatedUser.followers,
      }));

      // update Redux with new following list
      dispatch(updateFollowing(res.data.currentUserFollowing));
    } catch (err) {
      console.log(err);
    }
  };

  // ------------------------------
  // Delete Post
  // ------------------------------
  const deletePost = async (postId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUserPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section>
      <UserProfile
        user={user}
        currentUserId={currentUserId}
        handleFollowToggle={handleFollowToggle}
      />
      <HeaderInfo text={`${user?.fullName}'s posts`} />
      <section className="profile__posts">
        {userPosts?.length < 1 ? (
          <p className="center">No posts by this user</p>
        ) : (
          userPosts.map((post) => (
            <Feed key={post._id} post={post} onDeletePost={deletePost} />
          ))
        )}
      </section>

      {editPostModalOpen && <EditPostModal />}
      {editProfileModalOpen && <EditProfileModal />}
    </section>
  );
};

export default Profile;
