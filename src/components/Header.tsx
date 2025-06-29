"use client";
import React, { useContext } from "react";
import { signInWithGoogle } from "@/lib/firebase";
import { AuthContext } from "@/contexts/authContext";

const Header = () => {
  const currentUser = useContext(AuthContext);
  console.log("currentUser", currentUser);
  return (
    <header>
      ヘッダー
      <button onClick={signInWithGoogle}>ログイン</button>
    </header>
  );
};
export default Header;
