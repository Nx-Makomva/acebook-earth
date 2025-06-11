import { useState } from "react";
import Button from "./Button";

function Post(props) {
  const { _id, content, image } = props.post;

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLikes(prev => liked ? prev -1 : prev + 1);
    setLiked(!liked);
  };

  return (
    <article key={_id}>
      <p>{content}</p>
      {Array.isArray(image) && image.map((img, i) => {
        //convert buffer to base64 and render as <img />
        //and allows for multiple image storage.
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
            //also edited the use of template literals (backticks) to dynamically build the src string
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
    </article>
  );
}

export default Post;
