import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CreatePost = ({ onCreatePost,error }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  // const token = useSelector((state) => state?.user?.currentUser?.token);

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
    
    setLoading(true);
    await onCreatePost(formData);  
    // reset form
    setBody("");
    setImage(null);
    if(fileInputRef.current){
      fileInputRef.current.value="";
    }
    setLoading(false);
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
        
       {/* <div className="createPost__image-upload"> */}

      <input type="file" accept="image/*" onChange={handleImageChange}  ref={fileInputRef} 
      id='postImage' style={{display:"none"}}/>
       <button
    type="button"
    className="btn secondary"
    onClick={() => fileInputRef.current.click()}
  >
    {image ? "Change Image" : "Choose Image"}
  </button>
  {image && <span className="fileName">{image.name}</span>}
  {/* </div> */}
  
      <button type="submit" 
      className={`btn primary ${loading ? "btn-loading" : ""}`}
      disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
       {error && <p className="error">{error}</p>}
      </div>
    </form>
  );
};

export default CreatePost;
