"use client";

import SideNavBar from "@/components/SideNavBar";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { initilizeSocket, socket } from "@/utils/socket";
import { AuthContext } from "../page";

export default function SessionLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    const isReadyToConnect = useRef(true);
    const timeout = useRef(null);

    // Startup - Socket initilization
    const initilize = useMemo(async () => {
        await initilizeSocket();
        await socket;
    }, []);

    const onConnect = () => {
        isReadyToConnect.current = false;
        setIsConnected(true);
    };

    const onDisconnect = () => {
        isReadyToConnect.current = true;
        setIsConnected(false);
    };

    useEffect(() => {
        if (!socket) initilize;
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.disconnect();
        };
    }, []);

    async function autoConnect() {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            socket.disconnect();
        }, 1000*60*2);

        if (isReadyToConnect.current && !isConnected) {
            isReadyToConnect.current = false;
            socket.connect();
        }
    }

    if (!isAuthenticated) return null;

    return (
        <SessionContext.Provider
            value={{
                sessionState: [sessions, setSessions],
                isConnected,
                autoConnect,
            }}>
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

export const SessionContext = createContext(null);
