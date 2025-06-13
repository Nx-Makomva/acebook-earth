import { useState } from 'react';
import { handleLikeRequest } from '../services/likes'; // your API call

export default function LikeButton({ initialLiked = false, initialLikesCount = 0, postId }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const handleLikeClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const res = await handleLikeRequest(postId, userId, token);
      setIsLiked(res.liked); // backend returns the new state
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  return (
    <button 
      onClick={handleLikeClick}
      className={`like-button-container ${isLiked ? 'liked' : ''}`}
    >
      <svg 
        className="like-icon" 
        fill={isLiked ? "currentColor" : "none"} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="like-count">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
    </button>
  );
}