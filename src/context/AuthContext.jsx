import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("sargam_user")) || null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("sargam_token", data.token);
    localStorage.setItem(
      "sargam_user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("sargam_token", data.token);
    localStorage.setItem(
      "sargam_user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    return data;
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