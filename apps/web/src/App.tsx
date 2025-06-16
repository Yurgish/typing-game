import { Button } from '@repo/ui/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import CalendarHeatmap from 'react-calendar-heatmap';

import Keyboard from './components/Keyboard';
import SocialSignInButton from './components/SignButton';
import { authClient } from './lib/auth';
import { trpc } from './utils/trpc';

function App() {
  const { data: session, isPending } = authClient.useSession();
  const { data } = useQuery(trpc.userProgress.getUserActivityHeatmap.queryOptions());
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
      {data && session && (
        <div className="w-1/6">
          <CalendarHeatmap
            endDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
            values={
              data?.heatmapData
                ? Object.entries(data.heatmapData).map(([date, value]) => ({
                    date,
                    count: value.lessons
                  }))
                : []
            }
          />
        </div>
      )}
    </div>
  );
}

export default App;
