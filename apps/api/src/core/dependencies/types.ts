import {
  IAchievementRepository,
  ICharacterMetricRepository,
  IDailyActivityRepository,
  ILessonRepository,
  IScreenMetricsRepository,
  IUserLessonProgressRepository,
  IUserStatsRepository
} from '@api/repositories';
import { AchievementService, DailyActivityService, UserProgressService, UserStatsService } from '@api/services';

export type AppRepositories = {
  dailyActivityRepository: IDailyActivityRepository;
  userStatsRepository: IUserStatsRepository;
  achievementRepository: IAchievementRepository;
  screenMetricsRepository: IScreenMetricsRepository;
  lessonRepository: ILessonRepository;
  userLessonProgressRepository: IUserLessonProgressRepository;
  characterMetricsRepository: ICharacterMetricRepository;
};

export type AppServices = {
  dailyActivityService: DailyActivityService;
  userStatsService: UserStatsService;
  achievementService: AchievementService;
  userProgressService: UserProgressService;
};
