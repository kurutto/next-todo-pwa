import { db } from "@/lib/firebase";
import { TodoType } from "@/types/types";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
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
    return NextResponse.json(todos);
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}
