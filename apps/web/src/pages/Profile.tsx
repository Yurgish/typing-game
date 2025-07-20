import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@repo/ui/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import HeatMap from '@web/components/HeatMap';
import ProgressBar from '@web/components/ProgressBar';
import { authClient } from '@web/lib/auth';
import { LEVEL_THRESHOLDS } from '@web/lib/constansts';
import { useCurrentLessonStore } from '@web/stores/useCurrentLessonStore';
import { trpc } from '@web/utils/trpc';
import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router';

const Profile = () => {
  const { data: session } = authClient.useSession();

  const { data: heatmap } = useQuery(trpc.activityHeatmap.getUserActivityHeatmap.queryOptions());
  const { data: experienceData } = useQuery(trpc.userStats.getUserXpAndLevel.queryOptions());
  const { data: charactersData } = useQuery(trpc.characterMetrics.getCharacterMetrics.queryOptions());
  const { refetch } = useQuery({
    ...trpc.lessonProgress.getLastLessonByOrder.queryOptions(),
    enabled: false
  });

  const navigate = useNavigate();

  const { setCurrentLessonId, setCurrentScreenOrder } = useCurrentLessonStore();

  const startLastLesson = async () => {
    const { data: lastLesson } = await refetch(); // remake later, make it redirect to first lesson forst screen

    if (!lastLesson) return;

    setCurrentLessonId(lastLesson.lessonId);
    setCurrentScreenOrder(lastLesson.currentScreenOrder + 1);
    navigate(`/lesson/${lastLesson.lessonId}`);
  };

  const currentLevel = experienceData?.currentLevel ?? 1;
  const totalExperience = experienceData?.totalExperience ?? 0;

  const prevLevelXp = LEVEL_THRESHOLDS[currentLevel - 1] ?? 0;

  const xpOnThisLevel = totalExperience - prevLevelXp; // remake on server side, so we can use it directly

  const currentLevelSegment = LEVEL_THRESHOLDS[currentLevel] - LEVEL_THRESHOLDS[currentLevel - 1];

  return (
    <div className="min-w-[1200px] pt-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Avatar className="border-foreground size-[150px] border-1">
              <AvatarImage src={session?.user.image ?? undefined} alt="User Avatar" />
              <AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1">
                <h1 className="mb-1 text-2xl">{session?.user.name} </h1>
                <Badge variant="default" color="">
                  NewBuy
                </Badge>
              </div>
              <p>LVL: {experienceData?.currentLevel};</p>
              <p>XP to next LVL -&gt; {experienceData?.xpToNextLevel ?? 'error'};</p>
              <ProgressBar current={xpOnThisLevel} max={currentLevelSegment} />
            </div>
          </div>
        </div>
        {heatmap && session && (
          <div className="flex w-[50%] flex-col">
            <HeatMap heatmap={heatmap} />
            <div className="mt-4 self-end">
              <Button variant={'secondary'} onClick={startLastLesson} className="mr-4 text-base">
                Continue learning?
              </Button>
              <Button onClick={() => navigate('/profile/achievements')} className="text-base">
                <Trophy />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h1 className="mb-4 text-xl">Characters statistic</h1>
        <Carousel>
          <CarouselContent className="-ml-4">
            {charactersData &&
              charactersData.map((character) => (
                <CarouselItem key={character.character} className="basis-1/3 pl-4">
                  <div className="rounded-md border-2 p-4 transition-all">
                    <h2 className="mb-2 text-lg uppercase">
                      {character.character === ' ' ? 'Space' : character.character}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 text-base">
                      <div>
                        <p>
                          ✅ <span className="">Correct:</span> {character.correctCount}
                        </p>
                        <p>
                          ❌ <span className="">Errors:</span> {character.errorCount}
                        </p>
                      </div>

                      <div>
                        <p>
                          🎯 <span className="">Accuracy:</span>{' '}
                          <span
                            className={
                              character.accuracyPercentage > 90
                                ? 'text-correct'
                                : character.accuracyPercentage > 75
                                  ? 'text-chart-3'
                                  : 'text-error'
                            }
                          >
                            {character.accuracyPercentage}%
                          </span>
                        </p>
                        <p>
                          📉 <span>Error Ratio:</span> {character.errorRatio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex gap-2"></div>
      </div>
    </div>
  );
};

export default Profile;
