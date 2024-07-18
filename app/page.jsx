"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function Home({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem("token") || null;
        if (token) setIsAuthenticated(true);
        else setIsAuthenticated(false);
    }, []);

    useEffect(() => {
        if (isAuthenticated) router.replace("/session");
        else router.replace("/login");
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
            {children}
        </AuthContext.Provider>
    );
}
