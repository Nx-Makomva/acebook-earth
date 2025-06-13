const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

export async function addFriend(friendId) {

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `
    ${BACKEND_URL}/users/friends/${friendId}`,
    requestOptions
  );

  if (response.status === 200) {
    const data = await response.json();
    console.log("User new friends is:", data.user);
    return data;
  } else {
    throw new Error("Failed to add friend");
  }
}

export async function getAllFriends(id) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
  };

  const response = await fetch(`${BACKEND_URL}/users/profile/friends/${id}`, requestOptions)

  if (!response.ok) {
    throw new Error(`Error fetching friends: ${response.status}`)
  }

  const data = await response.json()
  return data
}
