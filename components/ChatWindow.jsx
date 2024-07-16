import toast from "react-hot-toast";
import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";

import { useContext, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BACKEND_URL, getAuthHeader } from "@/utils/auth";
import { SessionContext } from "@/app/session/layout";

export default function ChatWindow({ conversations, setConversations }) {
    const [sessions, setSessions] = useContext(SessionContext);
    const query = useSearchParams();
    const sessionId = usePathname().slice(9);

    const handleTerminate = async () => {
        try {
            let response = await fetch(
                `${BACKEND_URL}/api/sessions/${sessionId}`,
                { method: "PUT", headers: await getAuthHeader() }
            );

            if (!response.ok) throw response;

            setSessions(
                sessions.map((session) => {
                    if (session.attributes.sessionId === sessionId)
                        session.attributes.isActive = false;
                    return session;
                })
            );

            //
        } catch (err) {
            console.log(err);
            if (err instanceof TypeError)
                toast.error("Server connection refused.");
            else if (err.status >= 400 && err.status < 500)
                toast.error(err.statusText);
            else toast.error("Something went wrong.");
        }
    };

    const isActive = useMemo(() => {
        return sessions.some(
            (session) =>
                session.attributes.sessionId === sessionId &&
                session.attributes.isActive
        );
    }, [sessions]);

    const MemoizedChatInput = useMemo(
        () => (
            <ChatInput
                conversations={conversations}
                setConversations={setConversations}
            />
        ),
        [conversations]
    );

    return (
        <div className="flex h-full w-full">
            <div className="flex flex-col justify-between w-full gap-y-2">
                
                <div className="flex justify-between items-center w-full py-2 pr-6 pl-16 sm:pl-6 bg-indigo-600 font-semibold">
                    <p className="text-white">{query.get("name")}</p>
                    {isActive ? (
                        <button
                            className="w-fit bg-indigo-50 text-sm text-red-600 px-3 leading-6 rounded hover:bg-indigo-100"
                            onClick={handleTerminate}>
                            End Session
                        </button>
                    ) : (
                        ""
                    )}
                </div>

                {conversations && conversations.length > 0 ? (
                    <ChatContent conversations={conversations} />
                ) : (
                    <div className="flex flex-col w-full h-full gap-y-4 justify-center items-center text-sm font-semibold text-gray-500">
                        <p>No conversation</p>
                        <p>Start typing...</p>
                    </div>
                )}

                {isActive ? MemoizedChatInput : ""}
            </div>
        </div>
    );
}
