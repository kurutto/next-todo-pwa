import { TodoType } from "@/types/types";
import React from "react";

interface TodoListProps {
  todos: TodoType[];
  getTodo: () => void;
}
const TodoList = ({ todos, getTodo }: TodoListProps) => {
  const handleDeleteTodo = async(id: string) => {
    console.log("delete click")
    await fetch(
      "api/deleteTodo",
      {
        method: "POST",
          body: JSON.stringify({
          id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    getTodo();
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
