import { createContext } from "@repo/trpc/context";
import { appRouter } from "@repo/trpc/routers";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(4000, () => {
  console.log("🚀 API ready at http://localhost:4000/trpc");
});
