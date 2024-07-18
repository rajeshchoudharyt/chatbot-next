import toast from "react-hot-toast";
import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";

import { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BACKEND_URL, getAuthHeader } from "@/utils/auth";
import { SessionContext } from "@/app/session/layout";

export default function ChatWindow({ conversations, setConversations }) {
    const { sessionState, isConnected } = useContext(SessionContext);
    const [sessions, setSessions] = sessionState;
    const query = useSearchParams();
    const sessionId = usePathname().slice(9);

    const handleTerminate = async () => {
        let toastId = null;
        try {
            let response = fetch(`${BACKEND_URL}/api/sessions/${sessionId}`, {
                method: "PUT",
                headers: await getAuthHeader(),
            });
            toastId = toast.loading("Loading...");

            response = await response;
            if (!response.ok) throw response;

            const updatedSessions = sessions.map((session) => {
                if (session.attributes.sessionId === sessionId)
                    session.attributes.isActive = false;
                return session;
            });
            setSessions(updatedSessions);
            toast.success("Done.", { id: toastId });

            //
        } catch (err) {
            console.log(err);
            if (err instanceof TypeError)
                toast.error("Server connection refused.", { id: toastId });
            else if (err.status >= 400 && err.status < 500)
                toast.error(err.statusText, { id: toastId });
            else toast.error("Something went wrong.", { id: toastId });
        }
    };

    const isActive = sessions.some(
        (session) =>
            session.attributes.sessionId === sessionId &&
            session.attributes.isActive
    );

    return (
        <div className="flex h-full w-full">
            <div className="relative flex flex-col justify-between items-center w-full gap-y-2">
                <p className="absolute top-16 rounded-xl text-xs text-gray-700 font-semibold bg-gray-200 px-2 leading-5 ">
                    {isConnected ? "Server connected" : "Server disconnected"}
                </p>
                <div className="flex justify-between items-center w-full leading-8 py-3 pr-6 pl-16 sm:pl-6 bg-indigo-600 font-semibold">
                    <p className="text-white">
                        {query.get("name") || "Invalid Session"}
                    </p>
                    {isActive ? (
                        <button
                            className="w-fit bg-indigo-50 text-sm text-red-600 px-3 leading-7 rounded hover:bg-indigo-100"
                            onClick={handleTerminate}>
                            End
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

                {isActive ? (
                    <ChatInput
                        conversations={conversations}
                        setConversations={setConversations}
                        sessionId={sessionId}
                    />
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
