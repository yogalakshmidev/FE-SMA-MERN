import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LuUpload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { userActions } from "../store/user-slice";
import { uiSliceActions } from "../store/ui-slice";

const UserProfile = ({ user, currentUserId, handleFollowToggle }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const loggedInUserId = useSelector((state) => state?.user?.currentUser?.id);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  const [avatar, setAvatar] = useState(null);
  const [avatarTouched, setAvatarTouched] = useState(false);

  const following = useSelector((state) => state.user.currentUser?.following || []);
  const followsUser = following.map(String).includes(String(user?._id));

  // keep avatar synced
  useEffect(() => {
    if (user?.profilePhoto) setAvatar(user.profilePhoto);
  }, [user]);

  // Change avatar
  const changeAvatarHandler = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        formData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedAvatar = response?.data?.user?.profilePhoto;
      setAvatar(updatedAvatar);

      // Update Redux currentUser
      dispatch(
        userActions.changeCurrentUser({
          ...currentUser,
          profilePhoto: updatedAvatar,
        })
      );
      setAvatarTouched(false);
    } catch (error) {
      console.error("Error updating avatar:", error.response?.data?.message || error.message);
    }
  };

  const openEditProfileModal = () => {
    dispatch(uiSliceActions.openEditProfileModal());
  };

  return (
    <section className="profile">
      <div className="profile__container">
        {/* Profile Image */}
        <form
          className="profile__image"
          onSubmit={changeAvatarHandler}
          encType="multipart/form-data"
        >
          <img src={user?.profilePhoto || "/default-avatar.png"} alt={user?.fullName} />

          {user?._id === loggedInUserId && (
            <>
              {!avatarTouched ? (
                <label htmlFor="avatar" className="profile__image-edit">
                  <LuUpload />
                </label>
              ) : (
                <button type="submit" className="profile__image-btn">
                  <FaCheck />
                </button>
              )}
              <input
                type="file"
                id="avatar"
                accept="image/png, image/jpg, image/jpeg"
                onChange={(e) => {
                  setAvatar(e.target.files[0]);
                  setAvatarTouched(true);
                }}
              />
            </>
          )}
        </form>

        {/* User Info */}
        <h4>{user?.fullName}</h4>
        <small>{user?.email}</small>

        {/* Follows */}
        <ul className="profile__follows">
          <li>
            <h4>{user?.following?.length || 0}</h4>
            <small>Following</small>
          </li>
          <li>
            <h4>{user?.followers?.length || 0}</h4>
            <small>Followers</small>
          </li>
        </ul>

        {/* Actions */}
        <div className="profile__actions-wrapper">
          {user?._id === currentUserId ? (
            <button className="btn" onClick={openEditProfileModal}>
              Edit Profile
            </button>
          ) : (
            <button className="btn dark" onClick={handleFollowToggle}>
              {followsUser ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Bio */}
        <article className="profile__bio">
          <p className="center">{user?.bio}</p>
        </article>
      </div>
    </section>
  );
};

export default UserProfile;
