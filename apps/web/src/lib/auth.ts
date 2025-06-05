import { createAuthClient } from "better-auth/react";

import { env } from "./config";

export const authClient = createAuthClient({
  baseURL: env.VITE_API_URL,
});

export const { signIn, signUp, useSession, signOut } = authClient;
