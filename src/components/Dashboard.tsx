"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "@/contexts/authContext";
import { logIn } from "@/lib/firebase";
import { TodoType } from "@/types/types";
import TodoList from "./TodoList";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<TodoType[]>();

  const fetchGetTodos = useCallback(async () => {
    if (currentUser) {
      const res = await fetch("/api/getTodo", {
        method: "POST",
        body: JSON.stringify({
          uid: currentUser.uid,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await res.json();
      setTodos(data);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchGetTodos();
  }, [currentUser, fetchGetTodos]);

  const handlePostTodo = async () => {
    if (inputRef.current?.value && currentUser?.uid) {
      await fetch("api/addTodo", {
        method: "POST",
        body: JSON.stringify({
          content: inputRef.current.value,
          uid: currentUser.uid,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      inputRef.current.value = "";
      fetchGetTodos();
    }
  };
  return (
    <div>
      {currentUser ? (
        <div>
          <input placeholder="ToDoName" ref={inputRef} />
          <button onClick={handlePostTodo} type="button">
            追加
          </button>
        </div>
      ) : (
        <button onClick={logIn}>ログイン</button>
      )}
      {todos && currentUser && (
        <TodoList todos={todos} getTodo={fetchGetTodos} />
      )}
    </div>
  );
};

export default Dashboard;
