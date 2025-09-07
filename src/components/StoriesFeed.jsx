import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CreateStory from "./CreateStory";

const StoriesFeed = () => {
  const [stories, setStories] = useState([]);
  const token = useSelector((state) => state.user.currentUser?.token);

  const fetchStories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/stories/feed`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setStories(res.data.stories);
    } catch (error) {
      console.error("Error fetching stories:", error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleStoryCreated = (newStory) => {
    setStories((prev) => [newStory, ...prev]); // prepend new story
  };

  return (
    <div className="stories-container">
      <CreateStory onStoryCreated={handleStoryCreated} />

      <div className="stories-list">
        {stories.map((story) => (
          <div key={story._id} className="story-card">
            <div className="story-user">
              <img
                src={story.user.profilePhoto}
                alt={story.user.fullName}
                className="story-avatar"
              />
              <span>{story.user.fullName}</span>
            </div>

            {story.media && (
              <div className="story-media">
                {story.media.endsWith(".mp4") ? (
                  <video src={story.media} controls />
                ) : (
                  <img src={story.media} alt="story" />
                )}
              </div>
            )}

            {story.text && <p className="story-text">{story.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesFeed;
