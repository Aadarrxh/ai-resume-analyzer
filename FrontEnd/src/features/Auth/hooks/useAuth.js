import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { 
    login as loginApi, 
    register as registerApi, 
    logout as logoutApi, 
    getMe as getMeApi 
} from "../services/auth.api";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await loginApi({ email, password });
            if (data?.user) setUser(data.user);
            return {
                success: true,
                title: data?.title || "Sign In",
                message:
                    data?.message ||
                    "Logged In Successful",
                type: "success",
                data,
            }
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            return {
                success: false,
                title:
                    err.response?.data?.title ||
                    "Login Failed",
                message:
                    err.response?.data?.message ||
                    err.message ||
                    "Something went wrong",
                type: "error",
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
        const data = await registerApi({
            username,
            email,
            password,
        });

        console.log("REGISTER RESPONSE:", data);

        if (data?.user) {
            setUser(data.user);
        }      

        return {
            success: true,
            title: data?.title || "Registration",
            message:
                data?.message ||
                "Registration Successful",
            type: "success",
            data,
        };

    } catch (err) {
        console.error(
            "Registration failed:",
            err.response?.data || err.message
        );

        return {
            success: false,
            title:
                err.response?.data?.title ||
                "Registration Failed",
            message:
                err.response?.data?.message ||
                err.message ||
                "Something went wrong",
            type: "error",
        };

    } finally {
        setLoading(false);
    }
  };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutApi();
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMeApi();
                if (data?.user) setUser(data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, [setUser, setLoading]);

    return { user, loading, handleRegister, handleLogin, handleLogout };
};