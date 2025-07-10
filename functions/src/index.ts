// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
import { onRequest } from "firebase-functions/v2/https";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();

const setCorsHeaders = (res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};
const collectionRef = getFirestore().collection("todo");

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
export const addTodo = onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return; // プリフライトリクエストへの応答
  }
  const todo = req.body;
  // Push the new message into Firestore using the Firebase Admin SDK.
  await collectionRef.add({
    content: todo.content,
    uid: todo.uid,
    isComplete: false,
    createdAt: FieldValue.serverTimestamp(),
  });
  // Send back a message that we've successfully written the message
  res.status(200).json({ message: "Success" });
  // Grab the text parameter.
});

export const getTodo = onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return; // プリフライトリクエストへの応答
  }
  const uid = req.body.uid;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const data = await collectionRef.where("uid", "==", uid).get();
  const todos = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  // Send back a message that we've successfully written the message

  res.status(200).json(todos);
  // Grab the text parameter.
});

export const deleteTodo = onRequest(async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return; // プリフライトリクエストへの応答
  }
  const id = await req.body.id;
  // Push the new message into Firestore using the Firebase Admin SDK.
  await collectionRef.doc(id).delete();
  // Send back a message that we've successfully written the message

  res.status(200).json({ message: "Success" });
  // Grab the text parameter.
});
