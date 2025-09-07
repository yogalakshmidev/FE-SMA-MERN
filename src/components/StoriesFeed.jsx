import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CreateStory from "./CreateStory";

const StoriesFeed = () => {
  const [stories, setStories] = useState([]);
  const token = useSelector((state) => state.user.currentUser?.token);

  // Fetch stories from backend
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

  // Add new story (or replace temp story)
  const handleStoryCreated = (newStory, tempId = null) => {
    setStories((prev) => {
      if (tempId) {
        // Replace temp story with real one
        return prev.map((s) => (s._id === tempId ? newStory : s));
      }
      return [newStory, ...prev]; // prepend new story
    });
  };

  return (
    <div className="stories-container">
      <CreateStory onStoryCreated={handleStoryCreated} />

      <div className="stories-list">
        {stories.length === 0 ? (
          <p className="no-stories">No active stories within a day...</p>
        ) : (
          stories.map((story) => (
            <div key={story._id} className="story-card">
              <div className="story-user">
                <img src={story.user.profilePhoto} alt={story.user.fullName} className="story-avatar" />
                <span>{story.user.fullName}</span>
              </div>

              {story.media && (
                <div className="story-media">
                  {story.isUploading ? (
                    <div className="story-loading">Uploading...</div>
                  ) : story.media.endsWith(".mp4") ? (
                    <video src={story.media} controls />
                  ) : (
                    <img src={story.media} alt="story" />
                  )}
                </div>
              )}

              {story.text && <p className="story-text">{story.text}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StoriesFeed;
