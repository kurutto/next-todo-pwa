import React from "react";
// import logo from "./logo.svg";
// import "./App.css";
import "@/lib/firebase";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

export default function Page() {
  return (
    <div className="App">
      <Header />
      <Dashboard />
    </div>
  );
}
