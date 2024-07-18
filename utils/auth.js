const FRONTEND_URL = process.env.NEXT_PUBLIC_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function handleLogin(data) {
    try {
        sessionStorage.setItem("token", data.jwt);
        const response = await fetch(`${FRONTEND_URL}/api/session`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (err) {}
    return false;
}

async function handleLogout() {
    try {
        sessionStorage.removeItem("token");
        const response = await fetch(`${FRONTEND_URL}/api/session`, {
            method: "DELETE",
        });
        return response.ok;
    } catch (err) {}
    return false;
}

async function getToken() {
    try {
        const token = sessionStorage.getItem("token") || null;
        if (token) return token;

        const response = await fetch(`${FRONTEND_URL}/api/session`);
        if (!response.ok) return "";

        const user = await response.json();
        return user ? user.jwt : "";
    } catch (err) {}
    return "";
}

async function isLoggedIn() {
    const token = await getToken();
    return token.length > 0 ? true : false;
}

async function getAuthHeader() {
    let token = "";
    try {
        token = sessionStorage.getItem("token") || null;
    } catch (err) {}

    if (token) return { Authorization: `Bearer ${token}` };
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
