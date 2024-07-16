"use client";

import SideNavBar from "@/components/SideNavBar";

import { createContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";
import { socket } from "@/utils/socket";

export const SessionContext = createContext(null);

export default function SessionLayout({ children }) {
    const [collapsed, setCollapsed] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessions, setSessions] = useState([]);
    const router = useRouter();

    async function checkStatus() {
        if (await isLoggedIn()) setIsAuthenticated(true);
        else router.push("/login");
    }

    // Socket initialization
    const constructor = useMemo(async () => await socket, []);
    useEffect(() => {
        constructor;
    }, []);

    useEffect(() => {
        checkStatus();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <SessionContext.Provider value={[sessions, setSessions]}>
            <div className="flex w-full h-dvh">
                <section
                    className={`w-[80%] z-10 absolute sm:relative sm:w-1/3 transition-transform ease-in -translate-x-full sm:translate-x-0 ${
                        collapsed ? "-translate-x-full" : "translate-x-0"
                    }`}>
                    <SideNavBar
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        setIsAuthenticated={setIsAuthenticated}
                    />
                </section>
                <section className="w-[100%] bg-indigo-500 bg-opacity-5">
                    {children}
                </section>
            </div>
        </SessionContext.Provider>
    );
}
