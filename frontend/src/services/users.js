const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getById(id) {
    const response = await fetch(`${BACKEND_URL}/users/${id}`)

    if (response.status !== 200) {
        throw new Error(`Error ${response.status}: Unable to find user`);
    }

    const data = await response.json();
    console.log(data)
    return data
}