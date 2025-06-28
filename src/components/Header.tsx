"use client"
import React from "react";
import { signInWithGoogle } from "@/lib/firebase";

const Header = () => {
  return(
    <header>
      ヘッダー
      <button onClick={signInWithGoogle}>ログイン</button>
    </header>
  )
}
export default Header;