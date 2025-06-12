// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getFeed(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
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