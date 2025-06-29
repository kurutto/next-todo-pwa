"use client";
import React, { useContext } from "react";
import { logIn,logOut } from "@/lib/firebase";
import { AuthContext } from "@/contexts/authContext";

const Header = () => {
  const {currentUser} = useContext(AuthContext);
  console.log("currentUser", currentUser);
  return (
    <header>
      ヘッダー
      {currentUser ? <button onClick={logOut}>ログアウト</button> : <button onClick={logIn}>ログイン</button>}
    </header>
  );
};
export default Header;
