import { UserStats } from '@repo/database';

export type AchievementConditionData = Pick<
  UserStats,
  | 'totalLessonsCompleted'
  | 'totalPerfectLessons'
  | 'highestOverallWPM'
  | 'highestOverallAccuracy'
  | 'beginnerLessonsCompleted'
  | 'beginnerPerfectLessons'
  | 'highestBeginnerWPM'
  | 'highestBeginnerAccuracy'
  | 'mediumLessonsCompleted'
  | 'mediumPerfectLessons'
  | 'highestMediumWPM'
  | 'highestMediumAccuracy'
  | 'advancedLessonsCompleted'
  | 'advancedPerfectLessons'
  | 'highestAdvancedWPM'
  | 'highestAdvancedAccuracy'
  | 'currentStreak'
  | 'longestStreak'
  | 'totalExperience'
>;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (data: AchievementConditionData) => boolean;
  type: 'general' | 'beginner' | 'medium' | 'advanced' | 'streak' | 'experience' | 'other';
  icon?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // --- General Achievements ---
  {
    id: 'FIRST_STEP',
    name: 'First Step',
    description: 'Complete your first lesson.',
    condition: (data) => data.totalLessonsCompleted >= 1,
    type: 'general'
  },
  {
    id: 'MARATHONER_5',
    name: 'Marathoner -> 5',
    description: 'Complete 5 lessons.',
    condition: (data) => data.totalLessonsCompleted >= 5,
    type: 'general'
  },
  {
    id: 'MARATHONER_10',
    name: 'Marathoner -> 10',
    description: 'Complete 10 lessons.',
    condition: (data) => data.totalLessonsCompleted >= 25,
    type: 'general'
  },
  {
    id: 'MARATHONER_20',
    name: 'Marathoner -> 20',
    description: 'Complete 20 lessons.',
    condition: (data) => data.totalLessonsCompleted >= 25,
    type: 'general'
  },
  {
    id: 'SPEED_50WPM',
    name: 'Speed of Light (50 WPM)',
    description: 'Reach 50 WPM in any lesson.',
    condition: (data) => data.highestOverallWPM >= 50,
    type: 'general'
  },
  {
    id: 'SPEED_70WPM',
    name: 'Accelerator (70 WPM)',
    description: 'Reach 70 WPM in any lesson.',
    condition: (data) => data.highestOverallWPM >= 70,
    type: 'general'
  },
  {
    id: 'ACCURACY_98_OVERALL',
    name: 'Accuracy Champion (98%)',
    description: 'Achieve 98% accuracy in any lesson (best result).',
    condition: (data) => data.highestOverallAccuracy >= 0.98,
    type: 'general'
  },
  {
    id: 'PERFECT_LESSON_ANY_1',
    name: 'Perfect Lesson (1)',
    description: 'Complete 1 lesson without any mistakes.',
    condition: (data) => data.totalPerfectLessons >= 1,
    type: 'general'
  },
  {
    id: 'PERFECT_LESSON_ANY_5',
    name: 'Perfect Lesson (5)',
    description: 'Complete 5 lessons without any mistakes.',
    condition: (data) => data.totalPerfectLessons >= 5,
    type: 'general'
  },
  {
    id: 'EXPERIENCE_1000',
    name: 'Experienced User',
    description: 'Earn 1000 XP.',
    condition: (data) => data.totalExperience >= 1000,
    type: 'experience'
  },
  {
    id: 'STREAK_2_DAYS',
    name: 'Two-Day Streak',
    description: 'Train for 2 consecutive days.',
    condition: (data) => data.currentStreak >= 2,
    type: 'streak'
  },
  {
    id: 'STREAK_7_DAYS',
    name: 'Weekly Streak',
    description: 'Train for 7 consecutive days.',
    condition: (data) => data.currentStreak >= 7,
    type: 'streak'
  },
  {
    id: 'STREAK_30_DAYS',
    name: 'Monthly Streak',
    description: 'Train for 30 consecutive days.',
    condition: (data) => data.currentStreak >= 30,
    type: 'streak'
  },
  {
    id: 'LONGEST_STREAK_60',
    name: 'Legendary Streak',
    description: 'Reach a longest streak of 60 days.',
    condition: (data) => data.longestStreak >= 60,
    type: 'streak'
  },

  // --- Beginner Level Achievements ---
  {
    id: 'BEGINNER_MASTER',
    name: 'Beginner Master',
    description: 'Complete all beginner level lessons.',
    condition: (data) => data.beginnerLessonsCompleted === 10, // remake
    type: 'beginner'
  },
  {
    id: 'BEGINNER_SPEED_30WPM',
    name: 'First Steps of Speed (30 WPM)',
    description: 'Reach 30 WPM in a beginner level lesson.',
    condition: (data) => data.highestBeginnerWPM >= 30,
    type: 'beginner'
  },
  {
    id: 'BEGINNER_ACCURACY_95',
    name: 'Accurate Beginner',
    description: 'Achieve 95% accuracy in a beginner level lesson.',
    condition: (data) => data.highestBeginnerAccuracy >= 0.95,
    type: 'beginner'
  },
  {
    id: 'PERFECT_BEGINNER_5',
    name: 'Perfect Beginner (5)',
    description: 'Complete 5 beginner level lessons without mistakes.',
    condition: (data) => data.beginnerPerfectLessons >= 5,
    type: 'beginner'
  },

  // --- Medium Level Achievements ---
  {
    id: 'MEDIUM_MASTER',
    name: 'Steadfast Student',
    description: 'Complete all medium level lessons (15 lessons).', // Specify the number
    condition: (data) => data.mediumLessonsCompleted === 15, // Assuming 15 lessons
    type: 'medium'
  },
  {
    id: 'MEDIUM_SPEED_50WPM',
    name: 'Accelerator (50 WPM)',
    description: 'Reach 50 WPM in a medium level lesson.',
    condition: (data) => data.highestMediumWPM >= 50,
    type: 'medium'
  },
  {
    id: 'MEDIUM_ACCURACY_97',
    name: 'Rhythm Master',
    description: 'Achieve 97% accuracy in a medium level lesson.',
    condition: (data) => data.highestMediumAccuracy >= 0.97,
    type: 'medium'
  },
  {
    id: 'PERFECT_MEDIUM_10',
    name: 'Clean Run (10)',
    description: 'Complete 10 medium level lessons without mistakes.',
    condition: (data) => data.mediumPerfectLessons >= 10,
    type: 'medium'
  },

  // --- Advanced Level Achievements ---
  {
    id: 'ADVANCED_MASTER',
    name: 'Keyboard Guru',
    description: 'Complete all advanced level lessons (20 lessons).', // Specify the number
    condition: (data) => data.advancedLessonsCompleted === 20, // Assuming 20 lessons
    type: 'advanced'
  },
  {
    id: 'ADVANCED_SPEED_80WPM',
    name: 'Typing Machine (80 WPM)',
    description: 'Reach 80 WPM in an advanced level lesson.',
    condition: (data) => data.highestAdvancedWPM >= 80,
    type: 'advanced'
  },
  {
    id: 'ADVANCED_ACCURACY_99',
    name: 'Absolute Accuracy',
    description: 'Achieve 99% accuracy in an advanced level lesson.',
    condition: (data) => data.highestAdvancedAccuracy >= 0.99,
    type: 'advanced'
  },
  {
    id: 'PERFECT_ADVANCED_10',
    name: 'Zen Master (10)',
    description: 'Complete 10 advanced level lessons without any mistakes.',
    condition: (data) => data.advancedPerfectLessons >= 10,
    type: 'advanced'
  }
];
