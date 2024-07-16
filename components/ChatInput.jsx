"use client";

import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { socket } from "@/utils/socket";

export default function ChatInput({ conversations, setConversations }) {
    const [message, setMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const isReadyToConnect = useRef(true);
    const timeout = useRef(null);

    const pathname = usePathname();
    const sessionId = pathname.slice(9);

    function onConnect() {
        setIsConnected(true);
    }

    function onDisconnect() {
        setIsConnected(false);
        isReadyToConnect.current = true;
    }

    useEffect(() => {
        socket.io.opts.query = { sessionId };
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.disconnect();
        };
    }, []);

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (!isConnected) handleConnect();

        socket.emit("message", message.trim(), (response) => {
            if (!response.ok) toast.error(response.message);
            setConversations([...conversations, ...response.data]);
        });
        setMessage("");
    };

    function handleConnect() {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            socket.disconnect();
        }, 1000 * 60 * 2);

        if (isReadyToConnect.current) {
            isReadyToConnect.current = false;
            socket.connect();
        }
    }

    const handleChange = (event) => {
        setMessage(event.target.value);

        handleConnect();
    };

    return (
        <form
            className="relative flex justify-center w-full px-4 pb-4"
            autoComplete="off"
            onSubmit={handleSendMessage}>
            <p className="absolute -top-10 rounded-xl text-xs text-gray-800 bg-indigo-600 bg-opacity-10 px-3 leading-6 ">
                {isConnected ? "Server connected" : "Server disconnected"}
            </p>
            <textarea
                id="message"
                name="message"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleChange}
                required
                style={{ fieldSizing: "content" }}
                className="block w-full border-0 px-3 py-1.5 rounded-l-md mr-[1px] min-h-[1.5lh] max-h-[3.5lh]
                            resize-none placeholder:text-gray-400 sm:text-sm sm:leading-6 shadow-all"
            />
            <button
                type="submit"
                className="flex w-fit justify-center bg-indigo-600 px-3 py-1.5 rounded-r-md items-center
                            text-xs font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                            focus-visible:outline-indigo-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    className="fill-white">
                    <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                </svg>
            </button>
        </form>
    );
}
