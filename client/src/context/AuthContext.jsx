import { createContext, useContext, useState } from "react";
import * as authApi from "../api/Auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("jobtrail_user");

      if (!storedUser || storedUser === "undefined") {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid stored user:", error);
      localStorage.removeItem("jobtrail_user");
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("jobtrail_token");

    if (!storedToken || storedToken === "undefined") {
      return null;
    }

    return storedToken;
  });

  const login = async (email, password) => {
    const result = await authApi.loginUser(email, password);

    const userData = result?.data?.user || result?.user;
    const authToken = result?.data?.token || result?.token;

    if (!userData || !authToken) {
      throw new Error("Invalid login response from server");
    }

    localStorage.setItem("jobtrail_user", JSON.stringify(userData));
    localStorage.setItem("jobtrail_token", authToken);

    setUser(userData);
    setToken(authToken);

    return result;
  };

  const register = async (name, email, password) => {
    const result = await authApi.registerUser({
      name,
      email,
      password,
    });

    const userData = result?.data?.user || result?.user;
    const authToken = result?.data?.token || result?.token;

    if (userData && authToken) {
      localStorage.setItem("jobtrail_user", JSON.stringify(userData));
      localStorage.setItem("jobtrail_token", authToken);

      setUser(userData);
      setToken(authToken);
    }

    return result;
  };

  const logout = () => {
    localStorage.removeItem("jobtrail_user");
    localStorage.removeItem("jobtrail_token");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}