import { db } from "@/lib/firebase";
import { serverTimestamp } from "firebase/firestore";
import {
  collection,
  addDoc,
} from "firebase/firestore";

export async function POST(request:Request){
  const {content, uid} = await request.json();
  await addDoc(collection(db, "todo"), {
    content: content,
    uid: uid,
    isComplete: false,
    createdAt: serverTimestamp(),
  });
  return new Response("Todo added", { status: 201 });
}

