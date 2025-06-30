"use client";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/contexts/authContext";
import { logIn } from "@/lib/firebase";
import * as Api from "@/app/api/todo/route";
import { TodoType } from "@/types/types";
import TodoList from "./TodoList";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<TodoType[]>();

  const fetchGetTodos = useCallback(async () => {
    if (currentUser) {
      const data = await Api.getTodo(currentUser.uid);
      setTodos(data);
    }
  },[currentUser]);

  useEffect(() => {
    fetchGetTodos();
  }, [currentUser,fetchGetTodos]);

  const handlePostTodo = async () => {
    if (inputRef.current?.value && currentUser?.uid) {
      await Api.addTodo(inputRef.current?.value, currentUser?.uid);
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
      {todos && <TodoList todos={todos} getTodo={fetchGetTodos} />}
    </div>
  );
};

export default Dashboard;
