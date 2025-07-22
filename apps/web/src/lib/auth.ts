import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { env } from './config';

export const authClient = createAuthClient({
  baseURL: env.VITE_API_URL,
  plugins: [adminClient()]
});

export const { signIn, signUp, useSession, signOut } = authClient;

export type Session = typeof authClient.$Infer.Session;

export enum UserRole {
  User = 'user',
  Admin = 'admin'
}
