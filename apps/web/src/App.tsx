import { Button } from '@repo/ui/components/ui/button';

import Keyboard from './components/Keyboard';
import SocialSignInButton from './components/SignButton';
import { authClient } from './lib/auth';

function App() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }} className="bg-grad w-full">
      <SocialSignInButton provider="google" />
      <SocialSignInButton provider="github" />
      <div className="">
        {isPending && <p>Loading...</p>}
        {isPending === false && session && <p>Welcome, {session.user.name}!</p>}
        <p />
      </div>
      {session && (
        <Button
          onClick={async () => {
            await authClient.signOut();
          }}
        >
          Sign Out
        </Button>
      )}
      <Keyboard size="full" />
    </div>
  );
}

export default App;
