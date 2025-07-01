import { TodoType } from "@/types/types";
import React from "react";

interface TodoListProps {
  uid:string;
  todos: TodoType[];
  getTodo: () => void;
}
const TodoList = ({ uid, todos, getTodo }: TodoListProps) => {
  const handleDeleteTodo = async(id: string) => {
    console.log("delete click")
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/todo/${uid}/${id}`,
      {
        method: "DELETE",
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
