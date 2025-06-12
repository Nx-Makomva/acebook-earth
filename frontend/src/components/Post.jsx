import CommentSection from './CommentSection';
import LikeButton from "./LikeButton";

function Post(props) {
  const { _id, content, images = [], comments = [], likes = [], username } = props.post;

  // Early return if no content or images
  if (!content?.trim() && images.length === 0) return null;
  console.log("FROM POST COMPONENT:", images.map((img) => `data:${img.contentType};base64,}`
  ))
  return (
    <article key={_id} className="post-card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
      <p>{username}</p>
      <p>{content}</p>

      {images.map((img) => (
        <img
          key={img._id}
          src={`data:${img.image.contentType};base64,${img.image.data}`}
          alt={img.name || "Post image"}
          style={{ maxWidth: "300px", marginTop: "10px" }}
        />
      ))}

      <LikeButton
        initialLiked={props.isLiked}
        initialLikesCount={likes.length}
        postId={_id}
      />

      <CommentSection comments={comments} postId={_id} />
    </article>
  );
}

export default Post;