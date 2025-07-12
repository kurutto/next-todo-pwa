import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

initializeApp();

const isDevelopment = process.env.NODE_ENV !== "production";

// 開発環境のみCORS設定
const setCorsHeaders = (res: any, req: any) => {
  if (isDevelopment) {
    const allowedOrigins = ["http://localhost:3000"];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
      );
    }
  }
};
// 認証トークン検証
const verifyAuthToken = async (req: any): Promise<string> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new Error("認証トークンがありません");
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    //verifyIdTokenとはID トークンが正当なものかどうか（署名や期限）を検証し、その中身を取得するための関数。
    return decodedToken.uid;
  } catch (error) {
    throw new Error("無効な認証トークンです");
  }
};

const collectionRef = getFirestore().collection("todo");

export const addTodo = onRequest(async (req, res) => {
  try {
    setCorsHeaders(res, req);
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return; // プリフライトリクエストへの応答
    }
    //認証チェック
    const authenticatedUid = await verifyAuthToken(req);
    const { content, uid } = req.body;

    // リクエストのuidと認証されたuidの一致確認
    if (uid !== authenticatedUid) {
      res.status(403).json({ error: "権限がありません" });
      return;
    }

    await collectionRef.add({
      content: content,
      uid: uid,
      isComplete: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("addTodo error:", error);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

export const getTodo = onRequest(async (req, res) => {
  try {
    setCorsHeaders(res, req);
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return; // プリフライトリクエストへの応答
    }
    const authenticatedUid = await verifyAuthToken(req);
    const { uid } = req.body;

    // リクエストのuidと認証されたuidの一致確認
    if (uid !== authenticatedUid) {
      res.status(403).json({ error: "権限がありません" });
      return;
    }
    const data = await collectionRef.where("uid", "==", uid).get();
    const todos = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(todos);
  } catch (error) {
    console.error("getTodo error:", error);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

export const deleteTodo = onRequest(async (req, res) => {
  try {
    setCorsHeaders(res, req);
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return; // プリフライトリクエストへの応答
    }

    //認証チェック
    const authenticatedUid = await verifyAuthToken(req);
    const { id } = req.body;

    // 削除対象のTodoが認証ユーザーのものか確認
    const todoDoc = await collectionRef.doc(id).get();
    if (!todoDoc.exists) {
      res.status(404).json({ error: "Todoが見つかりません" });
      return;
    }

    const todoData = todoDoc.data();
    if (todoData?.uid !== authenticatedUid) {
      res.status(403).json({ error: "権限がありません" });
      return;
    }

    await collectionRef.doc(id).delete();

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("deleteTodo error:", error);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

export { nextApp } from "./nextApp";
