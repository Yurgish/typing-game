import { prisma } from "@repo/database/prisma";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { config } from "dotenv";

config();

export const createContext = async (_opts: CreateExpressContextOptions) => {
  return {
    prisma,
    user: null,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
