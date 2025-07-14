import React,{useState,useEffect} from 'react'
import CreatePost from '../components/CreatePost'
import {useSelector} from 'react-redux'
import axios from 'axios'
import Feeds from '../components/Feeds'

const Home = () => {
  
    const [posts,setPosts] = useState([])
    const[isLoading,setIsLoading] = useState(false)
    const[error,setError] = useState("")
    const token = useSelector(state => state?.user?.currentUser?.token)


    // to create post
  const createPost = async (data) => {
    setError("")
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data, {withCredentials: true, 
        headers:{Authorization: `Bearer ${token}`}})

      const newPost = response?.data;
      // console.log("response for the post",newPost)
      setPosts([newPost,...posts])
    } catch (err) {
      setError(err?.response?.data?.message)
    }
    
  }

  // to get posts
  const getPosts = async() => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`,
        {withCredentials: true,
        headers: {Authorization: `Bearer ${token}`}})

        setPosts(response?.data.posts)
        
    } catch (err) {
      console.log(err.response.data.message)
    }
    setIsLoading(false)
  }

useEffect(() => {
getPosts()
},[setPosts])

// console.log("post recently added",posts);
  return (
    <section className = 'mainArea'>
      <CreatePost onCreatePost = {createPost} error = {error} />
      
      <Feeds posts = {posts} onSetPosts = {setPosts}/>
      </section>
  )
}

export default Home