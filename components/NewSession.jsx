"use client";

import toast from "react-hot-toast";

import { useState } from "react";
import { BACKEND_URL, getAuthHeader } from "@/utils/auth";

export default function NewSession({ revalidateData }) {
    const [name, setName] = useState("");

    const handleNewSession = async (event) => {
        event.preventDefault();

        const sessionName = name;
        setName("");
        let toastId = null;

        try {
            let response = fetch(`${BACKEND_URL}/api/sessions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(await getAuthHeader()),
                },
                body: JSON.stringify({ sessionName }),
            });
            toastId = toast.loading("Validating...");

            response = await response;
            if (!response.ok) throw response;

            toast.success("Success", { id: toastId });
            revalidateData();

            //
        } catch (err) {
            if (err instanceof TypeError)
                toast.error("Server connection refused.", { id: toastId });
            else if (err.status === 404)
                toast.error("Wrong credientials.", { id: toastId });
            else toast.error("Something went wrong.", { id: toastId });
        }
    };

    return (
        <form
            className="space-y-2 px-4"
            autoComplete="off"
            onSubmit={handleNewSession}>
            <input
                id="name"
                name="name"
                type="text"
                minLength="5"
                maxLength="20"
                placeholder="Session name"
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
                required
                className="block w-full rounded-md border-0 px-3 py-1.5 shadow-sm 
									ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
									focus:ring-1 focus:ring-inset leading-7"
            />
            <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 
								text-sm font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 
								focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
								focus-visible:outline-indigo-600">
                Create
            </button>
        </form>
    );
}
