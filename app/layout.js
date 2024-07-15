import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "Chatbot demo",
    description: "A chatbot application",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        error: {
                            duration: 3000,
                            style: {
                                backgroundColor: "#dc3545",
                                color: "white",
                            },
                        },
                        success: {
                            duration: 2000,
                            style: {
                                backgroundColor: "#198754",
                                color: "white",
                            },
                        },
                    }}
                />
                {children}
            </body>
        </html>
    );
}
