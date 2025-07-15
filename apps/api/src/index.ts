import { appRouter } from '@api/routers';
import * as trpcExpress from '@trpc/server/adapters/express';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';

import { auth } from './lib/auth';
import { env } from './lib/config';
import { createContext } from './lib/context';

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
  })
);

app.listen(env.PORT, () => {
  console.log(`🚀 API ready at http://localhost:${env.PORT}`);
});
