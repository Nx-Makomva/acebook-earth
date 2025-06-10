const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getComments = async (postId, token) => {
  console.log("WE HIT THE GET COMMENTS FUNC", token)
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    
    const data = await response.json();
    console.log("HERE ARE THE COMMENTS FROM GET COMMENTS:", data.comments);
    return data.comments;

  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (postId, commentText, token, userId) => {
  try {
    console.log("POST_ID", postId, commentText, token, userId);
    const payload = {
        comment: commentText,
        userId: userId,
  };
  const requestOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
      },  
      body: JSON.stringify(payload),
  };
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, requestOptions);
    
    console.log("LOOK WHAT CAME BACK", response.body)

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    const data = await response.json();
    console.log("I AM FROM THE ADD COMMENT SERVICE:", data);
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const deleteComment = async (postId, commentId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};