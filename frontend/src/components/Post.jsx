import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

function Post(props) {
  const { _id, content, image, comments = [], likes = 0, username} = props.post;

  return (
    <article key={_id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
      <p>{username}</p>
      <p>{content}</p>
      
      {Array.isArray(image) && image.map((img, i) => {
        if (!img.image?.data || !img.image?.contentType) return null;

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
      

      <LikeButton initialLikes={likes} postId={_id} />
      
      <CommentSection comments={comments} postId={_id} />
    </article>
  );
}

export default Post;