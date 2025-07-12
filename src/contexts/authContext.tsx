"use client"
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState,createContext } from "react";

export interface AuthContextType {
  currentUser: User | null;
}

export const AuthContext = createContext<AuthContextType>({currentUser:null});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => user && setCurrentUser(user));
    //onAuthStateChanged:ユーザーがログインまたはログアウトしたときに呼ばれるイベントリスナー
    //第1引数：auth:Firebase Auth のインスタンス（getAuth() で取得）
    //第2引数：user:ユーザー情報（ログイン時にはユーザー情報が、ログアウト時には null が渡される）。user は auth.currentUser の略ではなく、ログイン状態が変化した瞬間のユーザーを、確実に渡してくれる安全な引数。
  }, []);

  return (
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  )
  
};
