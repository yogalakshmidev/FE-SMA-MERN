import React from 'react'
import Feed from './Feed'

const Feeds = ({posts,setPosts}) => {

   const handleDeletePost = (id) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== id))
  }
  // console.log("post in feeds are",posts)
  return(
    <div className = "feeds">
      {posts?.length < 1 ?( <p className = 'center'> No Posts found. </p> ):( 
      posts?.map((post) =>
        ( <Feed key={post?._id} post={post} onDeletePost={handleDeletePost}/>

       ) )
      )}
    </div>
  )
}

export default Feeds