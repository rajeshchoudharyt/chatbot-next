import toast from "react-hot-toast";
import Toggle from "./Toggle";
import NewSession from "./NewSession";
import ListItems from "./ListItems";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeader, handleLogout } from "@/utils/auth";
import { SessionContext } from "@/app/session/layout";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SideNavBar({
    collapsed,
    setCollapsed,
    setIsAuthenticated,
}) {
    const [sessions, setSessions] = useContext(SessionContext);
    const router = useRouter();

    const fetchData = async () => {
        try {
            let response = await fetch(
                `${BACKEND_URL}/api/sessions`,
                { headers: await getAuthHeader() }
            );

            if (!response.ok) throw response;
            response = await response.json();
            setSessions(response.data);
            //
        } catch (err) {
            if (err instanceof TypeError)
                toast.error("Server connection refused.");
            else if (err.status >= 400 && err.status < 500)
                toast.error(err.statusText);
            else toast.error("Something went wrong.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getSessions = (isActive = true) =>
        sessions.filter((session) => session.attributes.isActive == isActive);

    const handleClick = async () => {
        if (await handleLogout()) {
            setIsAuthenticated(false);
            router.push("/login");
        } else toast.error("Something went wrong. Try again");
    };

    return (
        <div className="bg-white">
            <div className="h-[92dvh]">
                <Toggle collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="overflow-hidden space-y-6">
                    <NewSession revalidateData={fetchData} />
                    <ListItems
                        name={"Active Sessions"}
                        sessions={getSessions()}
                        setCollapsed={setCollapsed}
                    />
                    <ListItems
                        name={"Session History"}
                        sessions={getSessions(false)}
                        setCollapsed={setCollapsed}
                    />
                </div>
            </div>
            <div className="h-[8dvh] text-end px-6">
                <button
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    onClick={handleClick}>
                    {"Sign out >"}
                </button>
            </div>
        </div>
    );
}
