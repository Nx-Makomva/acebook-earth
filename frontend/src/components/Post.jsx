import { useState } from "react";
import Button from "./Button";
import CommentSection from './CommentSection';

function Post(props) {
  const { _id, content, image, comments = [], username } = props.post;

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLikes(prev => liked ? prev -1 : prev + 1);
    setLiked(!liked);
  };


// import LikeButton from './LikeButton';
// import CommentSection from './CommentSection';

// function Post(props) {
//   const { _id, content, image, comments = [], likes = 0, username} = props.post;
//   if (!content?.trim() && (!image || image.length === 0)) return null;

  return (
    <article key={_id} className="post-card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
      <p>{username}</p>
      <p>{content}</p>
      
      {Array.isArray(image) && image.map((img, i) => {
        const base64String = btoa(
          new Uint8Array(img.image.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        return (
          <img
            key={i}
            src={`data:${img.image.contentType};base64,${base64String}`}
            alt={img.name || "Post image"}
            style={{ maxWidth: "300px", marginTop: "10px" }}
          />
        );
      })}

      <div style={{ marginTop: "10px" }}>
        <Button onClick={handleLike} variant="default" ariaLabel="like-button">
          {liked ? "❤️" : "🤍"} {likes}
        </Button>
      </div>
      

{/* //       <LikeButton initialLikes={likes} postId={_id} /> */}
      
      <CommentSection comments={comments} postId={_id} />
    </article>
  );
}

export default Post;