"use client";

import Link from "next/link";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { email, password };
        setEmail("");
        setPassword("");
        let toastId = null;

        try {
            let response = fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );
            toastId = toast.loading("Validating...");

            response = await response;
            if (!response.ok) throw response;

            toast.success("Registeration successful.", { id: toastId });
            router.replace("/login");

            //
        } catch (err) {
            if (err instanceof TypeError)
                toast.error("Server error: Connection refused.", {
                    id: toastId,
                });
            else if (err.status === 404)
                toast.error("Email already registered.", { id: toastId });
            else toast.error("Something went wrong.", { id: toastId });
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Register
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
									focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6"
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
                                minLength="6"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 px-3 py-1.5 shadow-sm 
									ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
									focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 
								text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 
								focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
								focus-visible:outline-indigo-600">
                            Register
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already registered?
                    <Link
                        href="/login"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
