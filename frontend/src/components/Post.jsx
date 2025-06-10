function Post({post}) {
  const { _id, content, image } = post;
  if (!content?.trim() && (!image || image.length === 0)) return null;

  return (
    <article key={_id} className="post-card">
      <p>{content}</p>
      {Array.isArray(image) && image.map((img, i) => {
        //convert buffer to base64 and render as <img />
        //and allows for multiple image storage.
        
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
    </article>
  );
}

export default Post;