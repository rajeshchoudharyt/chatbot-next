"use client";

import Link from "next/link";
import toast from "react-hot-toast";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL, handleLogin } from "@/utils/auth";
import { AuthContext } from "../page";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { identifier: email, password };
        setEmail("");
        setPassword("");
        let toastId = null;

        try {
            let response = fetch(`${BACKEND_URL}/api/auth/local`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            toastId = toast.loading("Validating...");

            response = await response;
            if (!response.ok) throw response;

            const isValid = await handleLogin(await response.json());
            if (!isValid)
                return toast.error("Something went wrong.", { id: toastId });

            toast.success("Success", { id: toastId });
            setIsAuthenticated(true);
            router.replace("/");

            //
        } catch (err) {
            if (err instanceof TypeError)
                toast.error("Server connection refused.", { id: toastId });
            else if (err.status === 404)
                toast.error("Wrong credientials.", { id: toastId });
            else toast.error("Something went wrong.", { id: toastId });

            setEmail(data.identifier);
        }
    };

    return (
        <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Login
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 px-3 py-1.5 shadow-sm 
									ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
									focus:ring-1 focus:ring-inset leading-7"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 px-3 py-1.5 shadow-sm 
									ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
									focus:ring-1 focus:ring-inset leading-7"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 
								text-sm font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 
								focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
								focus-visible:outline-indigo-600">
                            Login
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    New user?
                    <Link
                        href="/register"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
