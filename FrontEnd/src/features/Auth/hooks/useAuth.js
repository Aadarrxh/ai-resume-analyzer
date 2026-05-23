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
            return true;
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await registerApi({ username, email, password });
            console.log("Backend Response on Register:", data);
            
            if (data?.user) {
                setUser(data.user);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Registration failed:", err.response?.data || err.message);
            return false;
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