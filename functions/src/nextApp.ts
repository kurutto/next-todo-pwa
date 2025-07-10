import { onRequest } from "firebase-functions/v2/https";
import next from "next";

const app = next({
  dev: false,
  conf: {
    /* 必要ならconfigを渡す */
  },
});
const handle = app.getRequestHandler();

export const nextApp = onRequest((req, res) => {
  app.prepare().then(() => {
    handle(req, res);
  });
});
