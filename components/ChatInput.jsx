"use client";

import toast from "react-hot-toast";

import { useContext, useState } from "react";
import { socket } from "@/utils/socket";
import { SessionContext } from "@/app/session/layout";

export default function ChatInput({
    conversations,
    setConversations,
    sessionId,
}) {
    const { autoConnect } = useContext(SessionContext);
    const [message, setMessage] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();

        autoConnect();
        const data = { sessionId, message: message.trim() };
        setMessage("");

        socket.emit("message", data, (response) => {
            if (!response.ok) toast.error(response.message);
            setConversations([...conversations, ...response.data]);
        });
    };

    const handleChange = async (e) => {
        setMessage(e.target.value);
        autoConnect();
    };

    return (
        <form
            className="flex justify-center w-full px-4 pb-4"
            autoComplete="off"
            onSubmit={sendMessage}>
            <textarea
                id="message"
                name="message"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleChange}
                onFocus={() => autoConnect()}
                required
                style={{ fieldSizing: "content" }}
                className="block w-full border-0 px-3 py-3 rounded-l-md mr-[1px] min-h-[1.5lh] max-h-[3.5lh]
                            resize-none placeholder:text-gray-400 text-sm leading-6 shadow-all"
            />
            <button
                type="submit"
                className="flex w-fit justify-center bg-indigo-600 px-4 py-1.5 rounded-r-md items-center
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
