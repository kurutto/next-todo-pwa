import { TodoType } from "@/types/types";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/contexts/authContext";

interface TodoListProps {
  todos: TodoType[];
  getTodo: () => Promise<void>;
}
const TodoList = ({ todos, getTodo }: TodoListProps) => {
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState<string>("");

  const handleDeleteTodo = async (id: string) => {
    if (!currentUser || !id) return;
    try {
      setError("");
      const idToken = await currentUser.getIdToken();

      const res = await fetch("/api/deleteTodo", {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Todo削除に失敗しました");
      }
      await getTodo();
    } catch (error) {
      console.error("handleDeleteTodo error:", error);
      setError(
        error instanceof Error ? error.message : "Todo削除に失敗しました"
      );
    }
  };
  return (
    <div>
      <h2>あなたのToDo</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content}
            <button onClick={() => handleDeleteTodo(todo.id!)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
