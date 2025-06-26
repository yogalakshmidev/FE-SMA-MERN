import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const BookmarksPost = ({post}) => {
  
  const [user,setUser] = useState({})
  const[postBookmarked,setPostBookmarked] = useState(user?.userBookmarks?.bookmarks?.includes(post?._id))
  
  const token = useSelector(state => state?.user?.currentUser?.token)
  const userId = useSelector(state => state?.user?.currentUser?.id) 
  
    const getUser = async () =>{
   
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`,
        {withCredentials:true,
          headers:{Authorization:`Bearer ${token}`}})

        setUser(response?.data)

    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  useEffect(()=>{
    getUser()
  },[user,postBookmarked])

  // fn to create bookmark
  const createBookmark = async() =>{
    console.log("bookmark clicked")

try {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
    {withCredentials:true,
      headers:{Authorization:`Bearer ${token}`}
    }
  )
console.log("response from bookmark",response)
  if(response?.data?.userBookmarks?.bookmarks?.includes(post?._id)){
    setPostBookmarked(true)
  }else{
    setPostBookmarked(false)
  }

} catch (error) {
  console.log(error)
}
  }


  return (
    <button  className='feed__footer-bookmark' onClick={createBookmark}>
      {postBookmarked ? <FaBookmark/> : <FaRegBookmark />}
    </button>
  )
}

export default BookmarksPost