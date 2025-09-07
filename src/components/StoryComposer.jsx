// components/StoryComposer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StoryComposer = ({ onCreated }) => {
  const token = useSelector(state => state.user.currentUser?.token);
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [durationHours, setDurationHours] = useState(24);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!text && !file) {
      alert('Add text or a photo/video');
      return;
    }
    const formData = new FormData();
    formData.append('text', text);
    formData.append('durationHours', durationHours);
    if (file) formData.append('media', file);

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/stories`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setText('');
      setFile(null);
      onCreated && onCreated(res.data.story);
    } catch (err) {
      console.error(err);
      alert('Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="story-composer">
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Add a caption..." />
      <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files[0])} />
      <select value={durationHours} onChange={e => setDurationHours(Number(e.target.value))}>
        <option value={6}>6 hours</option>
        <option value={12}>12 hours</option>
        <option value={24}>24 hours</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Story'}</button>
    </form>
  );
};

export default StoryComposer;
