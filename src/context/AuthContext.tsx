import { signout } from "@/service/roulette";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextProps {
  isLogged: boolean;
  token: string | null;
  setToken: (token: string) => void;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setTokenState(newToken);
  };

  const login = (newToken: string) => {
    setToken(newToken);
    setIsLogged(true);
  };

  const logout = async () => {
    if (token) {
      try {
        await signout(token);
      } catch (error) {
        console.error("Failed to sign out", error);
      }
    }
    localStorage.removeItem("authToken");
    setTokenState(null);
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, token, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
