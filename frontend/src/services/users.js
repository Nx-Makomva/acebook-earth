const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export async function searchUsers(query) {
  const token = localStorage.getItem("token")

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
    throw new Error("Unable to fetch users")
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

