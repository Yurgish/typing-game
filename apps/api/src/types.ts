import { RouterOutputs } from '@api/trpc';

export enum LearningMode {
  KEY_INTRODUCTION = 'KEY_INTRODUCTION',
  LETTER_SEQUENCE = 'LETTER_SEQUENCE',
  DEFAULT = 'DEFAULT'
}

export enum LessonDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export type LessonType = RouterOutputs['lesson']['getById'];

export type UserLessonProgressType = RouterOutputs['userProgress']['getUserLessonProgress'];

export type ScreenMetricsReturnedType = NonNullable<UserLessonProgressType>['screenMetrics'][number];

export type CharacterMetricType = RouterOutputs['userProgress']['getCharacterMetrics'][number];

export type ScreenType = LessonType['screens'][number];

export type ScreenContentType = ScreenType['content'];

export type HeatMapType = RouterOutputs['userProgress']['getUserActivityHeatmap'];

export type FullMetricData = {
  rawWPM: number;
  adjustedWPM: number;
  accuracy: number;
  backspaces: number;
  errors: number;
  timeTaken: number;
  typedCharacters: number;
  correctCharacters: number;
};
