import { RouterOutputs } from '@api/trpc';

export enum LearningMode {
  KEY_INTRODUCTION = 'KEY_INTRODUCTION',
  LETTER_SEQUENCE = 'LETTER_SEQUENCE',
  DEFAULT = 'DEFAULT'
}

export type LessonType = RouterOutputs['lesson']['getById'];

export type UserLessonProgressType = RouterOutputs['lessonProgress']['getUserLessonProgress'];

export type ScreenMetricsReturnedType = NonNullable<UserLessonProgressType>['screenMetrics'][number];

export type CharacterMetricType = RouterOutputs['characterMetrics']['getCharacterMetrics'][number];

export type ScreenType = NonNullable<LessonType>['screens'][number];

export type ScreenContentType = ScreenType['content'];

export type HeatMapType = RouterOutputs['activityHeatmap']['getUserActivityHeatmap'];

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

export type FullMetricDataWithLearningMode = FullMetricData & {
  learningMode: LearningMode;
};
