import { useSubscription } from '@trpc/tanstack-react-query';
import { authClient } from '@web/lib/auth';
import { APP_ROUTES } from '@web/lib/routes';
import { trpc } from '@web/utils/trpc';
import { ArrowUpRight, ChevronsUp, Trophy } from 'lucide-react';
import { Outlet, useMatch } from 'react-router';
import { toast } from 'sonner';

export const LessonWrapper = () => {
  const { data: session } = authClient.useSession();

  const isLessonRoute: boolean = !!useMatch(APP_ROUTES.LESSON_DETAIL);
  const isLessonResultsRoute: boolean = !!useMatch(APP_ROUTES.LESSON_RESULTS);

  const isLessonActive = isLessonRoute || isLessonResultsRoute;

  useSubscription(
    trpc.sse.onUserXpEarned.subscriptionOptions(
      { userId: session?.user.id ?? '' },
      {
        enabled: !!session?.user.id && isLessonActive,
        onData: ({ data }) => {
          toast(`You earned ${data.xpEarned} XP!`, {
            icon: <ArrowUpRight size={20} />,
            classNames: {
              description: 'text-sm',
              content: 'ml-2',
              toast: 'custom-font'
            }
          });
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`);
        }
      }
    )
  );

  useSubscription(
    trpc.sse.onAchievementUnlocked.subscriptionOptions(
      { userId: session?.user.id ?? '' },
      {
        enabled: !!session?.user.id && isLessonActive,
        onData: ({ data }) => {
          toast(`${data.achievementName}`, {
            icon: <Trophy size={20} />,
            description: data.achievementDescription,
            classNames: {
              description: 'text-sm',
              content: 'ml-2',
              toast: 'custom-font'
            }
          });
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`);
        }
      }
    )
  );

  useSubscription(
    trpc.sse.onUserLevelUp.subscriptionOptions(
      { userId: session?.user.id ?? '' },
      {
        enabled: !!session?.user.id && isLessonActive,
        onData: ({ data }) => {
          toast(`You reached level ${data.newLevel}`, {
            icon: <ChevronsUp size={20} />,
            classNames: {
              description: 'text-sm',
              content: 'ml-2',
              toast: 'custom-font'
            }
          });
        },
        onError: (error) => {
          toast.error(`Error: ${error.message}`);
        }
      }
    )
  );

  return <Outlet />;
};
