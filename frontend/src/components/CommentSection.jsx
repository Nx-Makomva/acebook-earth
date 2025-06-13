import { useEffect, useState } from 'react';
import { getComments, addComment } from '../services/comments';


function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("COMMENT SECTION TOKEN", token);
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

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="comment-section">
      <button onClick={toggleComments} className="comment-toggle-button">
        <svg className="comment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="comment-count">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </button>

      {showComments && (
        <>
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              className="comment-input"
              value={newComment}
              placeholder="Write a comment..."
              onChange={(e) => setNewComment(e.target.value)}
              rows="2"
            />
            <button type="submit" className="comment-submit-button" disabled={!newComment.trim()}>
              Post
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((c, idx) => (
                <div key={idx} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{c.userName}</span>
                    <span className="comment-date">Just now</span>
                  </div>
                  <p className="comment-text">{c.comment}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {error && <p className="comment-error" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}

export default CommentSection;