import { LessonDifficulty, LessonDifficultyStats, Prisma, PrismaClient } from '@repo/database';

import { BaseRepository } from '../BaseRepository';
import { IUserStatsRepository, UserStatsPayload } from './IUserStatsRepository';

export class UserStatsRepository extends BaseRepository<'userStats'> implements IUserStatsRepository {
  constructor(db: PrismaClient) {
    super(db, 'userStats');
  }

  async findByUserId(userId: string) {
    return this.findUnique({
      where: { userId },
      include: {
        difficultyStats: true
      }
    });
  }

  async updateStreaks(userId: string, currentStreak: number, longestStreak: number): Promise<UserStatsPayload> {
    return this.update({
      where: { userId },
      data: {
        currentStreak,
        longestStreak
      },
      include: {
        difficultyStats: true
      }
    });
  }

  async initializeUserStats(userId: string): Promise<UserStatsPayload> {
    return this.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        difficultyStats: true
      }
    });
  }

  // async updateAllData(userId: string, data: Prisma.UserStatsUpdateInput): Promise<UserStatsPayload> {
  //   return this.update({
  //     where: { userId },
  //     data
  //   });
  // }

  async updateLevel(userId: string, newLevel: number): Promise<UserStatsPayload> {
    return this.update({
      where: { userId },
      data: { currentLevel: newLevel },
      include: {
        difficultyStats: true
      }
    });
  }

  async upsertLessonDifficultyStats(
    userId: string,
    difficulty: LessonDifficulty,
    data: Prisma.LessonDifficultyStatsUpdateInput
  ): Promise<LessonDifficultyStats> {
    return this.db.lessonDifficultyStats.upsert({
      where: {
        userId_difficulty: {
          userId: userId,
          difficulty: difficulty
        }
      },
      update: data,
      create: {
        userId: userId,
        difficulty: difficulty,
        lessonsCompleted: (data.lessonsCompleted as { increment: number })?.increment || 0,
        perfectLessons: (data.perfectLessons as { increment: number })?.increment || 0,
        highestWPM: (data.highestWPM as number) || 0,
        highestAccuracy: (data.highestAccuracy as number) || 0
      }
    });
  }
}
