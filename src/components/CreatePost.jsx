import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CreatePost = ({ onPostCreated }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body && !image) {
      return alert("Please add some text or an image");
    }

    const formData = new FormData();
    formData.append("body", body);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Post created:", response.data);
      onPostCreated?.(response.data);

      // reset form
      setBody("");
      setImage(null);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="createPost">
       <div className = 'createPost__top'>
      <textarea
        placeholder="What's on your mind?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      /></div>
       <div className = 'createPost__bottom'>
        
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
      </div>
    </form>
  );
};

export default CreatePost;
