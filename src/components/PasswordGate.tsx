import React, { useState } from "react";

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || "wizer~!"; // Set this in your .env

const PasswordGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [input, setInput] = useState("");
    const [authenticated, setAuthenticated] = useState(
        typeof window !== "undefined" && window.localStorage.getItem("app_authed") === "true"
    );
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input === APP_PASSWORD) {
            setAuthenticated(true);
            window.localStorage.setItem("app_authed", "true");
        } else {
            setError("Incorrect password");
        }
    };

    if (authenticated) return <>{children}</>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center ">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md flex flex-col items-center"
            >
                <h2 className="text-xl font-bold mb-4">Enter Application Password</h2>
                <input
                    type="password"
                    className="border px-3 py-2 rounded mb-2"
                    placeholder="Password"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded font-semibold"
                >
                    Unlock
                </button>
                {error && <div className="text-red-500 mt-2">{error}</div>}
            </form>
        </div>
    );
};

export default PasswordGate;