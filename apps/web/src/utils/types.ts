import type {
  Content as PrismaContent,
  Lesson as PrismaLesson,
  LessonDifficulty,
  Screen as PrismaScreen,
} from "@repo/database";

export type Lesson = PrismaLesson;
export type Screen = PrismaScreen;
export type Content = PrismaContent;

export { LessonDifficulty };

export type ScreenWithId = PrismaScreen & { id: string };

export type LessonWithScreenId = Omit<PrismaLesson, "screens"> & {
  screens: ScreenWithId[];
};

export enum LearningMode {
  KEY_INTRODUCTION = "KEY_INTRODUCTION",
  LETTER_SEQUENCE = "LETTER_SEQUENCE",
  DEFAULT = "DEFAULT",
}
