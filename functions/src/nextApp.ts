import { onRequest } from "firebase-functions/v2/https";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";

const app = next({
  dev,
  conf: {
    distDir: ".output/.next",
  },
});
const handle = app.getRequestHandler();

export const nextApp = onRequest({ timeoutSeconds: 60 }, async (req, res) => {
  await app.prepare();
  const parsedUrl = parse(req.url!, true);
  handle(req, res, parsedUrl);
});
