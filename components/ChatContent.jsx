import { useEffect, useRef } from "react";
import Message from "./Message";

export default function ChatContent({ conversations }) {
    const ref = useRef();

    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [conversations]);

    return (
        <div
            ref={ref}
            className={`flex flex-col h-full w-full py-4 px-6 overflow-y-auto space-y-2 scrollbar-none scroll-smooth`}>
            {conversations.map((conversation) => (
                <Message
                    key={conversation.id}
                    message={conversation.attributes.message}
                    role={conversation.attributes.role}
                />
            ))}
        </div>
    );
}
