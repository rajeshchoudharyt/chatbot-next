"use client";

import { io } from "socket.io-client";
import { BACKEND_URL, getToken } from "./auth";

let socket = null;

async function get() {
    const token = await getToken();
    socket = io(`${BACKEND_URL}`, {
        autoConnect: false,
        auth: { token },
    });
}
await get();

export { socket };
