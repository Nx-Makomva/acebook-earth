const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token")

export async function searchUsers(query) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/users/search?q=${encodeURIComponent(query)}`,
      requestOptions
    )

  if (!response.ok) {
    throw new Error(`Error searching users: ${response.status}`)
  }

  const data = await response.json()
  return data
}

export async function getById(id) {
  const response = await fetch(`${BACKEND_URL}/users/${id}`)

  if (response.status !== 200) {
      throw new Error(`Error ${response.status}: Unable to find user`);
  }

    const data = await response.json();
    console.log(data)
    return data
}

export async function updateById(id, update, token) {
  // const token = localStorage.getItem("token")
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(update)
  }

  const response = await fetch(`${BACKEND_URL}/users/${id}`, requestOptions)

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Update Failed")
  }

  return await response.json()
}