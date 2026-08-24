import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("sargam_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("User storage error:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      console.log("Registering user:", {
        name,
        email,
      });

      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const { data } = response;

      console.log("Register response:", data);

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("sargam_token", data.token);

      localStorage.setItem(
        "sargam_user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return data;
    } catch (error) {
      console.error(
        "Register API Error:",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Logging in:", email);

      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const { data } = response;

      console.log("Login response:", data);

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("sargam_token", data.token);

      localStorage.setItem(
        "sargam_user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return data;
    } catch (error) {
      console.error(
        "Login API Error:",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("sargam_token");
    localStorage.removeItem("sargam_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);