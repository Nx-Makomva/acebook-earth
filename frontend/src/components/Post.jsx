import { useState } from "react";

function Post(props) {
  const { _id, content, image, comments = [], likes = 0 } = props.post;
  const [ newComment, setNewComment ] = useState("");
  const[showComment, setShowComment] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(Array.isArray(likes) ? likes.length : 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setCurrentLikes(newLikeStatus ? currentLikes + 1: currentLikes - 1)
  
    console.log(`${newLikeStatus ? "Liking": "Unliking"} Post ${_id}`)

  }


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
    <div style={{ marginTop: '10px' }}>
        <button 
          onClick={handleLike}
          style={{ 
            background: isLiked ? '#ff6b6b' : '#f0f0f0',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isLiked ? '❤️ Liked' : '🤍 Like'}
        </button>
        <span style={{ marginLeft: '5px' }}>{currentLikes} likes</span>
      </div>
    </article>
  );
}

export default Post;
