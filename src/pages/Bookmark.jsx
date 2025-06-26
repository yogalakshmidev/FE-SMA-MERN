import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import FeedSkeleton from '../components/FeedSkeleton'
import Feed from '../components/Feed'

const Bookmark = () => {

const [bookmarks,setBookmarks] = useState([])
const [isLoading,setIsLoading]= useState(false)
const token = useSelector(state => state?.user?.currentUser?.token)

// get bookmarks for the logged user
const getBookmarks = async () =>{
  setIsLoading(true)
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/bookmarks`,
      {withCredentials: true,
        headers:{Authorization:`Bearer ${token}`}} )
console.log("bookmark response",response?.data?.userBookmarks?.bookmarks)
        setBookmarks(response?.data?.userBookmarks?.bookmarks)
  } catch (error) {
    console.log(error)
  }
  setIsLoading(false)
}

useEffect(()=>{
  getBookmarks()
},[])

console.log(bookmarks)


  return (
    <section>
      {isLoading? <FeedSkeleton /> :
      bookmarks?.length < 1 ? <p className='center'> No Posts bookmarked </p> : bookmarks?.map(bookmark => <Feed key= {bookmark?._id} post= {bookmark} />)}
    </section>
  )
}

export default Bookmark