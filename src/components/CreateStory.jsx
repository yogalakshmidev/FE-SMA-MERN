import React, { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateStory = ({ onStoryCreated }) => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const token = useSelector((state) => state.user.currentUser?.token);
  const currentUser = useSelector((state) => state.user.currentUser);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text && !media) {
      alert("Add text or media for your story");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (media) formData.append("media", media);

    // Create a temporary story for optimistic UI
    const tempStory = {
      _id: "temp-" + Date.now(),
      user: { ...currentUser },
      text,
      media: media ? URL.createObjectURL(media) : null,
      isUploading: true,
    };

    // Show temp story immediately
    onStoryCreated(tempStory);

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/stories`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Replace temp story with actual story from backend
      onStoryCreated(res.data.story, tempStory._id);
    } catch (error) {
      console.error("Error creating story:", error.response?.data?.message || error.message);
      alert("Failed to upload story.");
    } finally {
      setLoading(false);
      setText("");
      setMedia(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={submitHandler} className="createPost">
      <div className="createPost__top">
        <textarea
          placeholder="Write your story..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="createPost__bottom">
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={(e) => setMedia(e.target.files[0])}
          style={{ display: "none" }}
        />
        <button type="button" className="btn secondary" onClick={() => fileInputRef.current.click()}>
          {media ? "Change Media" : "Choose Media"}
        </button>
        {media && <span className="fileName">{media.name}</span>}
        <button type="submit" className={`btn primary ${loading ? "btn-loading" : ""}`} disabled={loading}>
          {loading ? "Uploading..." : "Post Story"}
        </button>
      </div>
    </form>
  );
};

export default CreateStory;
