import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "./auth.form.scss";

const Register = () => {
    const navigate = useNavigate();
    const { loading, handleRegister } = useAuth();

    // Keep the states so your inputs don't feel broken if typed into,
    // but we won't use them to build the final API payload!
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extracting data via native FormData guarantees 
        // that we ONLY extract raw text strings.
        const formData = new FormData(e.currentTarget);
        
        const payload = {
            username: formData.get("username")?.toString() || "",
            email: formData.get("email")?.toString() || "",
            password: formData.get("password")?.toString() || ""
        };

        console.log("CRITICAL SANITY CHECK - Payload Fields:", {
            usernameType: typeof payload.username,
            emailType: typeof payload.email,
            passwordType: typeof payload.password,
            rawValues: payload
        });

        const ok = await handleRegister(payload);
        if (ok) navigate("/");
    };

    if (loading) {
        return <main><h1>Loading.....</h1></main>;
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="reg-username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="reg-username"
                            name="username"
                            placeholder="Enter your username" // FormData looks at this name attribute
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="reg-email"
                            name="email"
                            placeholder="Enter your email" // FormData looks at this name attribute
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="reg-password"
                            name="password"
                            placeholder="Enter your password" // FormData looks at this name attribute
                            required
                        />
                    </div>

                    <button type="submit" className="button primary-button">Register</button>
                </form>

                <p>
                    Already have an Account? <Link to={"/login"}>Login</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;