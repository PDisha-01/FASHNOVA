import { useState } from "react";
import AuthContext from "./AuthContext";
import { getToken, removeToken } from "../services/auth";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading] = useState(false);

  function setAuthenticatedUser(userData) {
    setUser(userData);
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(getToken()),
    setAuthenticatedUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;