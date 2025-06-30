import { db } from "@/lib/firebase";
import { TodoType } from "@/types/types";
import { orderBy, serverTimestamp } from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

export const addTodo = (content: string, uid: string) => {
  addDoc(collection(db, "todo"), {
    content: content,
    uid: uid,
    isComplete: false,
    createdAt: serverTimestamp(),
  });
};

export const getTodo = async (uid: string) => {
  const q = query(
    collection(db, "todo"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const todos: TodoType[] = [];
  querySnapshot.forEach((doc) => {
    todos.push({
      id: doc.id,
      content: doc.data().content,
      isComplete: doc.data().isComplete,
      createdAt: doc.data().createdAt,
    });
  });
  return todos;
};

export const deleteTodo = async(id:string) => {
  await deleteDoc(doc(db, "todo", id));
};
