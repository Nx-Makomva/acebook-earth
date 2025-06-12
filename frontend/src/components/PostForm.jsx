import './PostForm.css';
import { useState } from "react";
import { createPost } from "../services/posts";


function PostForm({ token, onPostCreated}) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null)

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handlePostClick = async () => {
        const formData = new FormData()
            formData.append('content', content)
            if (image) {
                formData.append('image', image)
    }

    try {
        await createPost(formData, token);
        setContent('');
        setImage(null);
        if (onPostCreated) onPostCreated();
    } catch (err) {
        console.error('Failed to create post:', err);
    }
    };




    return (
        <div className="postFormContainer">
        <h2>Create a new post</h2>
        <form>
            <label>Share your thoughts:
            </label>
            <textarea 
            id='content' 
            value={content} 
            onChange={(e)=>setContent(e.target.value)} 
            required
            />
                <label>Image(optional)</label>
                <input id='image' type='file' onChange={handleImageChange}></input>
                {image && (<div><p>You selected {image.name}</p></div>)}
                <button type='button' onClick={handlePostClick}>
                    Post
                </button>
        </form>
        </div>

    );
}
export default PostForm;


