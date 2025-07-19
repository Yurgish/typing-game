import { AppRepositories, AppServices } from '@api/core/dependencies/types';
import { auth } from '@api/core/lib/auth';
import { prisma } from '@repo/database/prisma';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { fromNodeHeaders } from 'better-auth/node';
import { config } from 'dotenv';

config();

export type Context = {
  prisma: typeof prisma;
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  repositories: AppRepositories;
  services: AppServices;
};

export const createContext = async (
  { req }: CreateExpressContextOptions,
  initializedServices: AppServices,
  initializedRepositories: AppRepositories
): Promise<Context> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });

  return {
    prisma,
    session,
    repositories: initializedRepositories,
    services: initializedServices
  };
};
