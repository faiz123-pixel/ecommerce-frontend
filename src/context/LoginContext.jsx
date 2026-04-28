import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setAuthenticated(true);
    }
  }, []);

  const login = (userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(jwtToken);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setAuthenticated(false);
  };

  return (
    <LoginContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </LoginContext.Provider>
  );
};
