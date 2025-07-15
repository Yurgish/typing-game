import type {
  FullMetricData,
  HeatMapType,
  LessonType,
  ScreenContentType,
  ScreenMetricsReturnedType,
  ScreenType,
  UserLessonProgressType
} from '@repo/trpc/types';

export type Lesson = LessonType;
export type Screen = ScreenType;
export type Content = ScreenContentType;

export enum LessonDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum LearningMode {
  KEY_INTRODUCTION = 'KEY_INTRODUCTION',
  LETTER_SEQUENCE = 'LETTER_SEQUENCE',
  DEFAULT = 'DEFAULT'
}

export type ScreenWithId = ScreenType & { id: string };

export type LessonWithScreenId = Omit<LessonType, 'screens'> & {
  screens: ScreenWithId[];
};

export { FullMetricData, HeatMapType, ScreenMetricsReturnedType, UserLessonProgressType };
