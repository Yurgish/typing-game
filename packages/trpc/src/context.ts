import { prisma } from "@repo/database/prisma";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { fromNodeHeaders } from "better-auth/node";
import { config } from "dotenv";

import { auth } from "../../../apps/api/src/lib/auth"; // Need to remake

config();

export type Context = {
  prisma: typeof prisma;
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
};

export const createContext = async ({ req }: CreateExpressContextOptions): Promise<Context> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return {
    prisma,
    session,
  };
};
