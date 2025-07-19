import { appRouter } from '@api/routers';
import { prisma } from '@repo/database/index';
import * as trpcExpress from '@trpc/server/adapters/express';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';

import { initializeDependencies } from './core/dependencies';
import { auth } from './core/lib/auth';
import { env } from './core/lib/config';
import { createContext } from './core/lib/context';

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

const { services, repositories } = initializeDependencies(prisma);

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: (opts) => createContext(opts, services, repositories)
  })
);

app.listen(env.PORT, () => {
  console.log(`🚀 API ready at http://localhost:${env.PORT}`);
});
