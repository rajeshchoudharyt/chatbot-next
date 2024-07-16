"use client";

import { io } from "socket.io-client";
import { getToken } from "./auth";

let socket = null;

async function get() {
    const token = await getToken();
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
        autoConnect: false,
        auth: { token },
    });
}

await get();

export { socket };
