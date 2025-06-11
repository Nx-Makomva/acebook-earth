const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function handleLikeRequest(postId, userId, token) {
  console.log("I AM THE TOKEN FROM handleLikeRequest:", token)  
  const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postId, userId })
  });

  if (!response.ok) {
    throw new Error("Failed to update like");
  }

  return response.json();
}
