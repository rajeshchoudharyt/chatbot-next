import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ListItems({ sessions, name, setCollapsed }) {
    const pathname = usePathname();

    return (
        <div className="pl-4 pr-3">
            <p className="font-semibold text-gray-500 text-xs mb-2">{name}</p>

            {sessions && sessions.length > 0 ? (
                <div className="max-h-[25dvh] overflow-y-auto pr-1">
                    <ul role="list" className="flex flex-col gap-y-1">
                        {sessions.map((session) => (
                            <Link
                                key={session.attributes.sessionId}
                                href={{
                                    pathname:
                                        "/session/" +
                                        session.attributes.sessionId,
                                    query: { name: session.attributes.name },
                                }}
                                onClick={() => setCollapsed(true)}
                                className={`leading-10 bg-indigo-500 bg-opacity-5 text-sm px-2 font-semibold rounded
                                            hover:bg-opacity-20 hover:text-indigo-600 ${
                                                pathname.slice(9) ===
                                                session.attributes.sessionId
                                                    ? "text-indigo-600 bg-opacity-20"
                                                    : ""
                                            }`}>
                                {session.attributes.name}
                            </Link>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-xs font-semibold text-gray-400 pl-4">None</p>
            )}
        </div>
    );
}
