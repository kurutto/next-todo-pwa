"use client"
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState,createContext } from "react";

export interface AuthContextType {
  currentUser: string | null;
}

export const AuthContext = createContext<AuthContextType>({currentUser:null});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => user && setCurrentUser(user.uid));
  }, []);

  return (
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  )
  
};
