import React, { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
import HeaderInfo from "../components/HeaderInfo";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import Feed from '../components/Feed'
import EditPostModal from "../components/EditPostModal";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id: userId } = useParams();
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const editPostModalOpen = useSelector(state => state?.ui?.editPostModalOpen)
  const editProfileModalOpen = useSelector(state => state?.ui?.editProfileModalOpen)

  // get user's post
  const getUserPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("response from profiledata",response?.data)
      setUser(response?.data?.posts);
      setUserPosts(response?.data?.posts?.posts);
    } catch (error) {
      console.log(error);
    }   
    setIsLoading(false);
  };
  useEffect(() => {
    getUserPosts();
  }, [userId]);

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}`,{withCredentials: true, headers:{Authorization:`Bearer ${token}`}})

      setUserPosts(userPosts?.filter(p=>p?._id != postId))
    } catch (error) {
      console.log(error)
    }
  };

const updatePost = async (data,postId) =>{
  try {
    const response = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${postId}`,data,{withCredentials: true, headers:{Authorization:`Bearer ${token}`}})
// console.log("while updating post",response?.data)
    if(response?.status == 200) {
      const updatedPost = response?.data;
      setUserPosts(userPosts?.map(post =>{
        if(updatedPost?._id.toString() == post?._id.toString()){
          post.body = updatedPost.body;
        }
        return post;
      }))}

  } catch (error) {
    console.log(error.response?.useParamswaaage)
  }
}


  return (
    <section>
      <UserProfile />
      <HeaderInfo text={`${user?.fullName}'s posts`} />
      <section className="profile__posts">
        {userPosts?.length < 1 ? (
          <p className="center">No post by this user'</p>
        ) : (
          userPosts?.map((post) => (
            <Feed key={post?._id} post={post} onDeletePost={deletePost} />
          ))
        )}
      </section>
      {editPostModalOpen && <EditPostModal onUpdatePost = {updatePost}/>}

      {editProfileModalOpen && <EditProfileModal />}
    </section>
  );
};

export default Profile;
