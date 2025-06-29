import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuUpload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { userActions } from "../store/user-slice";
import { uiSliceActions } from "../store/ui-slice";

const UserProfile = () => {
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const loggedInUserId = useSelector((state) => state?.user?.currentUser?.id);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  const [user, setUser] = useState({});
  const [followsUser, setFollowsUser] = useState(
    user?.followers?.includes(loggedInUserId)
  );
  const [avatar, setAvatar] = useState(user?.profilePhoto);
  const { id: userId } = useParams();
  const [avatarTouched, setAvatarTouched] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get user details from database

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response?.data?.user);
      console.log("user details in myProfile",response?.data?.user)
      setFollowsUser(response?.data?.user?.followers?.includes(loggedInUserId));
      console.log("avatar response from loggedinUser",response?.data?.user?.profilePhoto)
      setAvatar(response?.data?.user?.profilePhoto);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  

  //////
  const changeAvatarHandler = async (e) => {
    e.preventDefault();
    setAvatarTouched(true);
    console.log("going to change avatar",avatar)
    try {
      const postData = new FormData();
      console.log("form data is",postData)
      postData.set("avatar", avatar);
      console.log("form data after set avatar is",postData)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(
        userActions?.changeCurrentUser({
          ...currentUser,
          profilePhoto: response?.data?.profilePhoto,
        }));
      navigate(0);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const openEditProfileModal = () => {
    dispatch(uiSliceActions.openEditProfileModal());
  };

  const followUnfollowUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/follow-unfollow`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setFollowsUser(response?.data?.followers?.includes(loggedInUserId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId,followsUser,avatar]);

  return (
    <section className="profile">
      <div className="profile__container">
        <form
          className="profile__image"
          onSubmit={changeAvatarHandler}
          encType="multipart/form-data"
        >
          <img src={user?.profilePhoto} alt="" />
          {!avatarTouched ? (
            <label htmlFor="avatar" className="profile__image-edit">
              <span>
                <LuUpload />
              </span>
            </label>
          ) : (
            <button type="submit" className="profile__image-btn">
              <FaCheck />
            </button>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={(e) => {
              setAvatar(e.target.files[0]);
              console.log("avatar changed value",avatar)
              setAvatarTouched(true);
            }}
            accept="png,jpg,jpeg"
          />
        </form>
        <h4>{user?.fullName}</h4>
        <small>{user?.email}</small>

        <ul className="profile__follows">
          <li>
            <h4>{user?.following?.length}</h4>
            <small>Following</small>
          </li>
          <li>
            <h4>{user?.followers?.length}</h4>
            <small>Followers</small>
          </li>

          <li>
            <h4>0</h4>
            <small>Likes</small>
          </li>
        </ul>

        <div className="profile__actions-wrapper">
          {user?._id == loggedInUserId ? (
            <button className="btn" onClick={openEditProfileModal}>
              Edit Profile
            </button>
          ) : (
            <button onClick={followUnfollowUser} className="btn dark">
              {" "}
              {followsUser ? "Unfollow" : "Follow"}
            </button>
          )}

          {user?._id != loggedInUserId && (
            <Link to={`/messages/${user?._id}`} className="btn default">
              Message
            </Link>
          )}
        </div>
        <article className="profile_bio">
          <p className="center"> {user?.bio}</p>
        </article>
      </div>
    </section>
  );
};

export default UserProfile;
