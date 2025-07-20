import { AppRouter } from '@api/routers';
import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink, httpSubscriptionLink, splitLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { env } from '@web/lib/config';
import superjson from 'superjson';

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        return op.type === 'subscription';
      },
      true: httpSubscriptionLink({
        url: `${env.VITE_API_URL}/trpc`,
        transformer: superjson
      }),
      false: httpBatchLink({
        url: `${env.VITE_API_URL}/trpc`,
        transformer: superjson,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include'
          });
        }
      })
    })
  ]
});
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient
});
