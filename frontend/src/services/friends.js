const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function addFriend(friendId) {
  const token = localStorage.getItem("token");

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
