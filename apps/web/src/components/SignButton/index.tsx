import { Button } from "@repo/ui/components/ui/button";

import { signIn } from "@/lib/auth";
import { env } from "@/lib/config";

interface SocialSignInButtonProps {
  provider: "google" | "github";
}

const icons = {
  google: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <path d="M16 7.005A6.08 6.08 0 0 0 12 5.5c-3.452 0-6.25 2.91-6.25 6.5s2.798 6.5 6.25 6.5c2.78 0 5.137-1.889 5.949-4.5H12.5v-4h9.564q.184.973.186 2c0 5.799-4.59 10.5-10.25 10.5S1.75 17.799 1.75 12S6.34 1.5 12 1.5c2.625 0 5.02 1.01 6.832 2.673zm-.305 10.238l3.137 2.584M6.051 14l-3.244 2.649M6.051 10L2.807 7.35" />
    </svg>
  ),
  github: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
};

const labels = {
  google: "Google",
  github: "GitHub",
};

const SocialSignInButton = ({ provider }: SocialSignInButtonProps) => {
  const handleSignIn = async () => {
    await signIn.social({
      provider,
      callbackURL: env.VITE_FRONTEND_URL,
    });
  };

  return (
    <Button
      onClick={handleSignIn}
      className="flex items-center gap-2"
      variant="outline"
    >
      <span>{labels[provider]}</span>
      {icons[provider]}
    </Button>
  );
};

export default SocialSignInButton;
