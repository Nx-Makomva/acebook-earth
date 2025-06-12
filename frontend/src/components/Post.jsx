import CommentSection from './CommentSection';
import LikeButton from "./LikeButton";

function Post(props) {
  const { _id, content, image, comments = [], likes = [], username} = props.post;
  if (!content?.trim() && (!image || image.length === 0)) return null;

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
      
      <LikeButton initialLiked={props.isLiked} initialLikesCount={likes.length} postId={_id} />
      
      <CommentSection comments={comments} postId={_id} />
    </article>
  );
}

export default Post;