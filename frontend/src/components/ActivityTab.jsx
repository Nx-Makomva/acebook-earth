import { MessageCircle } from 'lucide-react';
import Post from './Post'; // Import your actual Post component

export function ActivityTab({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="profile-card activity-card">
        <div className="card-header">
          <h3>Recent Activity</h3>
        </div>
        <div className="card-content">
          <div className="activity-empty-state">
            <div className="empty-icon">
              <MessageCircle size={48} />
            </div>
            <h4>No Posts Yet</h4>
            <p>When this person bothers to share something interesting, 
              it&#39;ll appear here. Until then, enjoy the peaceful silence! 🤫</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-tab-container">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <span className="activity-count">{posts.length} posts</span>
      </div>
      
      <div className="activity-feed">
        {posts.map((post) => (
          <div key={post._id} className="activity-post-wrapper">
            <Post 
              post={post}
              />
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}