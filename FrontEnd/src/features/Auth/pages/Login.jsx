import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./styles/auth.form.scss";
import useAppNavigate from "../../ui/hooks/navigator";
import { useNotification } from "../../ui/context/Notification.context";
import Button from "../../ui/components/buttons/Button";

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const goTo = useAppNavigate();

    const {addNotification} = useNotification();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            addNotification({
                title: "Invalid Credentials",
                message: "Empty values can't be entertained",
                type: "info",
            });

            return;
        }

        const res = await handleLogin({ email, password });

        if (res.success){
            addNotification({
                title: res.title || "Login Success",
                message: res.message || "Welcome back!",
                type: res.type || "success",
            });

            setEmail("");
            setPassword("");
            goTo("/app");
        }
        else{
            console.log("me chal ra hu!");

            addNotification({
                title: res.title || "Login Failed",
                message: res.message || "Unknown Error",
                type: res.type || "error",
            });
        }
        
    };

    if (loading) {
        return <main><h1>Loading....</h1></main>;
    }

    return (
        <main>
            <div className="form-container offset-black">
                <h1>Access The <br /> Protocol</h1>
                <p>Autheniticate to Continue your hiring <br /> Intelligence Journey</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           type="email"
                           id="email"
                           name="email"
                           placeholder="Enter your email"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                        />
                    </div>

                    <Button text="Sign In" color="#fff"  bg="#000"/>
                </form>

                <p>
                    Don't have an Account? <Link to={"/register"}>Sign Up</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
