import React from 'react'
import Feed from './Feed'

const Feeds = ({posts}) => {
  // console.log("post in feeds are",posts)
  return(
    <div className = "feeds">
      {posts?.length < 1 ? <p className = 'center'> No Posts found. </p> : 
      posts?.map((post) => <Feed key={post?._id} post={post} />)}
    </div>
  )
}

export default Feeds