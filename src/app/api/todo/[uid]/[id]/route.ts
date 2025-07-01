import { db } from "@/lib/firebase";
import {
  doc,
  deleteDoc,
} from "firebase/firestore";
import {NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { uid:string;id: string } }) {
  try{
    const { id } = await params;
    console.log("id",id);
    if(!id){
      return NextResponse.json(
        {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }
    await deleteDoc(doc(db, "todo", id));
    return NextResponse.json({ status: 201 });
  }catch(err){
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
