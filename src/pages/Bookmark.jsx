import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import FeedSkeleton from '../components/FeedSkeleton';
import Feed from '../components/Feed';
import BookmarksPost from '../components/BookmarksPost';

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(state => state?.user?.currentUser?.token);

  // Fetch bookmarks
  const getBookmarks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/bookmarks`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      
      setBookmarks(response?.data?.userBookmarks?.bookmarks || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getBookmarks();
  }, [token]);


const handleBookmarkChange = (postId, isBookmarked) => {

  if (isBookmarked) {
    setBookmarks(prev => [...prev, postId]); // add
  } else {
    setBookmarks(prev => prev.filter(id => id !== postId)); // remove
  }

};

  return (
    <section>
      {isLoading ? <FeedSkeleton /> :
        bookmarks?.length < 1 ?
          <p className='center'>No Posts bookmarked</p> :
          bookmarks.map(bookmark =>
       bookmarks.map(bookmark =>
  <Feed 
    key={bookmark?._id} 
    post={bookmark}
    onBookmarkChange={handleBookmarkChange}   
  />
)

          )
      }
    </section>
  );
};

export default Bookmark;
