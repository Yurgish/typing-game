import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@repo/ui/components/ui/dialog';
import { authClient, useSession } from '@web/lib/auth';
import { APP_ROUTES } from '@web/lib/routes';
import { useLocation, useNavigate } from 'react-router';

import SocialSignInButton from './SignButton';
import { ThemeToggle } from './ThemeToggle';

// thats kinda bad, but im not fixin it

const HeadersButtons = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === APP_ROUTES.PROFILE) {
    return (
      <div className="absolute top-10 right-10 z-10 flex items-center justify-end gap-4">
        <ThemeToggle />
        <Button variant={'ghost'} className="text-lg" onClick={() => navigate(APP_ROUTES.LESSONS)}>
          Back to Lessons
        </Button>
        <Button variant={'ghost'} className="text-lg" onClick={() => authClient.signOut()}>
          Log out
        </Button>
      </div>
    );
  }

  return session ? (
    <div className="absolute top-10 right-10 z-10 flex items-center justify-end gap-4">
      <ThemeToggle />
      <Button variant={'ghost'} className="text-lg" onClick={() => navigate(APP_ROUTES.PROFILE)}>
        Profile
      </Button>
      {session?.user?.role === 'admin' && (
        <Button variant={'ghost'} className="text-lg" onClick={() => navigate(APP_ROUTES.ADMIN_DASHBOARD)}>
          Dashboard
        </Button>
      )}
    </div>
  ) : (
    <div className="absolute top-10 right-10 z-10 flex items-center justify-end gap-4">
      <ThemeToggle />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'ghost'} className="text-lg">
            Sign Up
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[600px] p-8">
          <DialogHeader className="flex flex-row items-center justify-center gap-4">
            <div>
              <DialogTitle className="text-2xl">Sign Up</DialogTitle>
              <DialogDescription className="text-base">
                You can sign up with your Google or GitHub account.
              </DialogDescription>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <SocialSignInButton provider="google" />
              <SocialSignInButton provider="github" />
            </div>
          </DialogHeader>
          <DialogFooter className="text-sm">
            After signing up, you can access your profile and track your progress. 😉
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeadersButtons;
