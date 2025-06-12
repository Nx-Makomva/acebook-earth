import { useState } from 'react';
import {handleLikeRequest } from '../services/likes'; // your API call

export default function LikeButton({ initialLiked = false, initialLikesCount = 0, postId }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")
      const res = await handleLikeRequest(postId, userId, token);
      setIsLiked(res.liked); // backend returns the new state
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <button 
        onClick={handleLikeClick}
        style={{ 
          background: isLiked ? '#ff6b6b' : '#f0f0f0',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
      <span style={{ marginLeft: '5px' }}>{likesCount} likes</span>
    </div>
  );
}
