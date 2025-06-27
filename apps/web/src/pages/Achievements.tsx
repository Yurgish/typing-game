import { cn } from '@repo/ui/lib/utils'; // якщо є утиліта для класів
import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, Lock } from 'lucide-react';

import { trpc } from '@/utils/trpc';

const Achievements = () => {
  const { data: achievements, isLoading, error } = useQuery(trpc.userProgress.getAchievements.queryOptions());

  if (isLoading) return <div>Downloading...</div>;
  if (error) return <div>Error loading achievements</div>;
  if (!achievements) return <div>No achievement data available</div>;

  return (
    <div className="p-4 py-30">
      <h2 className="mb-6 text-3xl">Achievements</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={cn(
              'rounded-2xl border p-4 shadow-sm transition-all duration-300',
              ach.unlocked
                ? 'border-green-400 bg-green-100 text-green-900'
                : 'bg-muted text-muted-foreground opacity-50'
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xl">{ach.name}</div>
              {ach.unlocked ? <BadgeCheck className="text-green-500" /> : <Lock className="text-gray-400" />}
            </div>
            <p className="text-sm">{ach.description}</p>
            {ach.unlockedAt && (
              <p className="mt-2 text-xs text-gray-500">Received: {new Date(ach.unlockedAt).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
