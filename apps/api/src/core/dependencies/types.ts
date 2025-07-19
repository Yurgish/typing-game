import { IAchievementRepository } from '@api/repositories/achivement/IAchievementRepository';
import { ICharacterMetricRepository } from '@api/repositories/characterMetric/ICharacterMetricRepository';
import { IDailyActivityRepository } from '@api/repositories/dailyActivity/IDailyActivityRepository';
import { ILessonRepository } from '@api/repositories/lesson/ILessonRepository';
import { IScreenMetricsRepository } from '@api/repositories/screenMetric/IScreenMetricsRepository';
import { IUserLessonProgressRepository } from '@api/repositories/userLessonProgress/IUserLessonProgressRepository';
import { IUserStatsRepository } from '@api/repositories/userStats/IUserStatsRepository';
import { AchievementService } from '@api/services/AchievementService';
import { DailyActivityService } from '@api/services/DailyActivityService';
import { UserProgressService } from '@api/services/UserProgressService';
import { UserStatsService } from '@api/services/UserStatsService';

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
