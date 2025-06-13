import { useState } from "react";
import "./PostForm.css"; // Create this file for styling

const PostForm = ({ onSubmit, token }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await onSubmit(formData, token);
      setContent("");
      setImage(null);
    } catch (err) {
      setError("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-form">
      <h3>Create a Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        
        <div className="form-group">
          <label htmlFor="image-upload">Add Image (optional):</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && <p>Selected: {image.name}</p>}
        </div>

        {error && <p className="error">{error}</p>}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
