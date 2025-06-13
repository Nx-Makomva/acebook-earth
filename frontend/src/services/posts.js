// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getPosts(token) {
  const response = await fetch(`${BACKEND_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();
  console.log("LOOK AT ALL THIS DATA:" , data)
  return data.posts;
}


export async function getPostById(postId, token) {
  const response = await fetch(`${BACKEND_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch the post");
  }

  const data = await response.json();
  return data.post;
}


export async function createPost(formData, token) {
  const response = await fetch(`${BACKEND_URL}/posts`, {
    methods: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return await response.json();
}

export async function getFeed(userId, token) {
  const response = await fetch(`${BACKEND_URL}/posts/feed/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch feed");
  }

  const data = await response.json();
  console.log("DATA FROM getFeed:", data);
  return data.posts;
}


export async function createPost(postData, token) {
  console.log("TOKEN FROM CREATE POST FE:", token);
  const response = await fetch(`${BACKEND_URL}/posts`, {
    method: "POST",
    body: postData,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return await response.json();
}


export async function editPost(postId, postData, token) {
  const response = await fetch(`${BACKEND_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  const data = await response.json();
  return data.posts; 
}


export async function deletePost(postId, token) {
  const response = await fetch(`${BACKEND_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  const data = await response.json();
  return data.posts; 
}
