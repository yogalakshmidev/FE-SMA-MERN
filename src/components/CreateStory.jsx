import React, { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateStory = ({ onStoryCreated }) => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // ✅ create ref here
  const token = useSelector((state) => state.user.currentUser?.token);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text && !media) {
      alert("Add text or media for your story");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (media) {
      formData.append("media", media);
    }

    try {
      setLoading(true);
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

      onStoryCreated(res.data.story); // update parent feed
      setText("");
      setMedia(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset file input
    } catch (error) {
      console.error(
        "Error creating story:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
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
        {/* ✅ hidden file input with ref */}
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={(e) => setMedia(e.target.files[0])}
          style={{ display: "none" }}
        />

        <button
          type="button"
          className="btn secondary"
          onClick={() => fileInputRef.current.click()}
        >
          {media ? "Change Media" : "Choose Media"}
        </button>

        <button
          type="submit"
          className={`btn primary ${loading ? "btn-loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CreateStory;
