import { useEffect, useState } from 'react';
import { getComments, addComment } from '../services/comments';
// import { getCurrentUser } from '../services/authentication';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getComments(postId, token)
      .then(data => {
        console.log("HERE IS the COMMENTS", data);
        setComments(data);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load comments.");
      });
  }, [postId, newComment]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !newComment.trim()) return;

    try {
      const added = await addComment(postId, newComment, token, userId);
      setComments(prev => [...prev, added]); // Assume server returns the full comment object
      setNewComment('');
    } catch (err) {
      console.error(err);
      setError("Failed to post comment.");
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <h4>Comments:</h4>
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((c, idx) => (
        <div key={idx}>
          <strong>{c.userName}:</strong> {c.comment}
        </div>
      ))}

      <form onSubmit={handleAddComment} style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={newComment}
          placeholder="Write a comment..."
          onChange={(e) => setNewComment(e.target.value)}
          style={{ padding: '5px', width: '70%' }}
        />
        <button type="submit" style={{ marginLeft: '5px' }}>Post</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CommentSection;
