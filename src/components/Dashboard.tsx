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
  const [error, setError] = useState<string>("");

  const getAuthHeaders = async () => {
    if (!currentUser) throw new Error("ユーザーが認証されていません");
    const idToken = await currentUser.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      //Authorization ヘッダーは、HTTP通信において「リクエストを送る人が誰かをサーバーに伝えるための情報（認証情報）」を載せるための標準的なHTTPヘッダー
    };
  };

  const fetchGetTodos = useCallback(async () => {
    if (!currentUser) return;
    try {
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch("/api/getTodo", {
        method: "POST",
        body: JSON.stringify({
          uid: currentUser.uid,
        }),
        headers: headers,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("fetchGetTodos error:", error);
      setError(
        error instanceof Error ? error.message : "Todo取得に失敗しました"
      );
    }
  }, [currentUser, getAuthHeaders]);

  useEffect(() => {
    fetchGetTodos();
  }, [currentUser, fetchGetTodos]);

  const handlePostTodo = async () => {
    if (!inputRef.current?.value || !currentUser?.uid) return;
    try {
      setError("");
      const headers = await getAuthHeaders();
      const res = await fetch("/api/addTodo", {
        method: "POST",
        body: JSON.stringify({
          content: inputRef.current.value,
          uid: currentUser.uid,
        }),
        headers: headers,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Todo追加に失敗しました");
      }
      inputRef.current.value = "";
      await fetchGetTodos();
    } catch (error) {
      console.error("handlePostTodo error:", error);
      setError(
        error instanceof Error ? error.message : "Todo追加に失敗しました"
      );
    }
  };
  return (
    <div>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          エラー: {error}
        </div>
      )}
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
