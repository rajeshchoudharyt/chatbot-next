const FRONTEND_URL = process.env.NEXT_PUBLIC_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function handleLogin(data) {
    const response = await fetch(`${FRONTEND_URL}/api/session`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response.ok;
}

async function handleLogout() {
    const response = await fetch(`${FRONTEND_URL}/api/session`, {
        method: "DELETE",
    });
    return response.ok;
}

async function getToken() {
    const response = await fetch(`${FRONTEND_URL}/api/session`);
    if (!response.ok) return "";

    const user = await response.json();
    return user ? user.jwt : "";
}

async function isLoggedIn() {
    const token = await getToken();
    return token.length > 0 ? true : false;
}

async function getAuthHeader() {
    return { Authorization: `Bearer ${await getToken()}` };
}

export {
    handleLogin,
    handleLogout,
    getAuthHeader,
    isLoggedIn,
    getToken,
    BACKEND_URL,
};
