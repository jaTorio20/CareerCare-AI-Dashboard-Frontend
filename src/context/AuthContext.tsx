import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";
import { toast } from "sonner";
import type { User } from "@/types";

export type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: AuthContextType['user']) => void;
  isAuthLoading: boolean 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => { //this will cover the entire app
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType['user'] | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const { accessToken: newToken, user } = await refreshAccessToken();
        setAccessToken(newToken);
        setUser(user);
        setStoredAccessToken(newToken);

      // Only show toast if flag is set
      if (user && sessionStorage.getItem("justLoggedIn")) {
        toast.success(`Welcome back, ${user.name}!`);
        sessionStorage.removeItem("justLoggedIn");
      }
      } catch (err) {
        setUser(null)
        setAccessToken(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    loadAuth();
  }, []);//For running it on mount

  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]); //if it change we will set setStoredAccessToken

  return (
    <AuthContext.Provider value={{accessToken, setAccessToken, user, setUser, isAuthLoading,}}> 
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => { //useAuth has an access to AuthProvider, since its shared among global state
  const context = useContext(AuthContext);
  if(!context) throw new Error('useAuth must be used within a provider');
  return context;
};
