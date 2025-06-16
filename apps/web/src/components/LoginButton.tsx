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
import { useLocation, useNavigate } from 'react-router';

import { authClient } from '@/lib/auth';

import SocialSignInButton from './SignButton';

const LoginButton = () => {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/profile') {
    return (
      <Button variant={'ghost'} className="text-lg" onClick={() => navigate('/lessons')}>
        Back to Lessons
      </Button>
    );
  }

  return session ? (
    <Button variant={'ghost'} className="text-lg" onClick={() => navigate('/profile')}>
      Profile
    </Button>
  ) : (
    <Dialog>
      <DialogTrigger>
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
  );
};

export default LoginButton;
