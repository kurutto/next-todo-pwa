import { onRequest } from "firebase-functions/v2/https";
// @ts-ignore
import server from "../../.next/standalone/server.js";//next15ではビルドによってサーバアプリがこの場所に生成される

export const nextApp = onRequest(server);
