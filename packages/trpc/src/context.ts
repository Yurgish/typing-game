import { prisma } from "@repo/database";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { config } from "dotenv";

config();

export const createContext = async (opts: CreateExpressContextOptions) => {
  return {
    prisma,
    user: null,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
