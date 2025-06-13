import CommentSection from './CommentSection';
import LikeButton from "./LikeButton";
import "../assets/styles/Post.css"

function Post(props) {
  const { _id, content, images = [], comments = [], likes = [], username } = props.post;
  console.log("Images array:", images);
  console.log("First image:", images[0]);
  // console.log("FROM POST COMPONENT:", images.map((img) => `data:${img.contentType};base64,}`))
 
  // Early return if no content or images
  if (!content?.trim() && images.length === 0) return null;

  return (
//     <article key={_id} className="post-card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
//       <p>{username}</p>
//       <p>{content}</p>

//       {images.map((img) => (
//         <img
//           key={img._id}
//           src={`data:${img.image.contentType};base64,${img.image.data}`}
//           alt={img.name || "Post image"}
//           style={{ maxWidth: "300px", marginTop: "10px" }}
//         />
//       ))}

//       <LikeButton
//         initialLiked={props.isLiked}
//         initialLikesCount={likes.length}
//         postId={_id}
//       />


    <article key={_id} className="post-container">
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar-container">
            
            {images.map((img) => (
              <img
                key={img._id}
                src={`data:${img.image.contentType};base64,${img.image.data}`}
                alt={img.name || "Post image"}
                style={{ maxWidth: "300px", marginTop: "10px" }}
              />
            ))}
            
            <div className="post-user-status"></div>
          </div>
          <div className="post-meta">
            <h3 className="post-username">{username}</h3>
            <div className="post-timestamp">
              <svg className="timestamp-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Just now</span>
            </div>
          </div>
        </div>
      </div>

      <div className="post-content">
        {content && <p className="post-text">{content}</p>}
        
        {Array.isArray(image) && image.map((img, i) => {
          const base64String = btoa(
            new Uint8Array(img.image.data.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );

          return (
            <div key={i} className="post-image-container">
              <img
                className="post-image"
                src={`data:${img.image.contentType};base64,${base64String}`}
                alt={img.name || "Post image"}
              />
            </div>
          );
        })}
      </div>
      
      <LikeButton initialLiked={props.isLiked} initialLikesCount={likes.length} postId={_id} />
      
      <CommentSection comments={comments} postId={_id} />
    </article>
  );
}

export default Post;