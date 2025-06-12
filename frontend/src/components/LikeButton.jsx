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
//     <div style={{ marginTop: '10px' }}>
//       <button 
//         onClick={handleLikeClick}
//         style={{ 
//           background: isLiked ? '#ff6b6b' : '#f0f0f0',
//           border: 'none',
//           padding: '5px 10px',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         {isLiked ? '❤️ Liked' : '🤍 Like'}
//       </button>
//       <span style={{ marginLeft: '5px' }}>{likesCount} likes</span>
//     </div>
//   );
// }

// import { useState } from 'react';
// import Button from './Button';

// export default function LikeButton({ initialLikes = 0, postId }) {
//   const [likes, setLikes] = useState(initialLikes);
//   const [isLiked, setIsLiked] = useState(false);

//   const handleLike = () => {
//     const newLikeStatus = !isLiked;
//     setIsLiked(newLikeStatus);
//     setLikes(newLikeStatus ? likes + 1 : likes - 1);
    
//     // API call would go here
//     console.log(`${newLikeStatus ? 'Liking' : 'Unliking'} post ${postId}`);
//   };

//   return (
//     <div style={{ marginTop: '10px' }}>
//       <button 
//         onClick={handleLike}
//         style={{ 
//           background: isLiked ? '#ff6b6b' : '#f0f0f0',
//           border: 'none',
//           padding: '5px 10px',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         {isLiked ? '❤️ Liked' : '🤍 Like'}
//       </button>
//       <span style={{ marginLeft: '5px' }}>{likes} likes</span>
//     </div>
//   );
// }

// const LikeButton = ({ onClick }) => {
//   return(
    <Button variant="default" onClick={onClick} ariaLabel="like-button">
      Like ❤️
    </Button>
  );
};

export default LikeButton;
