"use client";

import toast from "react-hot-toast";
import ChatWindow from "@/components/ChatWindow";

import { useEffect, useState } from "react";
import { BACKEND_URL, getAuthHeader } from "@/utils/auth";

export default function Page({ params }) {
    const [conversations, setConversations] = useState([]);
    let toastId = null;

    const fetchData = async () => {
        try {
            console.log(document.cookie);
            let response = fetch(
                `${BACKEND_URL}/api/conversations/${params.id}`,
                { headers: await getAuthHeader() }
            );
            toastId = toast.loading("Loading...", { id: toastId });

            response = await response;
            if (!response.ok) throw response;

            toast.success("Loaded", { id: toastId });
            response = await response.json();
            setConversations(response.data);

            //
        } catch (err) {
            if (err instanceof TypeError)
                toast.error("Server connection refused.", { id: toastId });
            else if (err.status === 401)
                toast.error("Unauthorized.", { id: toastId });
            else toast.error("Something went wrong.", { id: toastId });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ChatWindow
            conversations={conversations}
            setConversations={setConversations}
        />
    );
}
