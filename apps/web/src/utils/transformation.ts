import { Screen, ScreenWithId } from "./types";

export const addIdToScreen = (screen: Screen, lessonOrder: number, screenIndex: number): ScreenWithId => {
  return {
    ...screen,
    id: `screen-${lessonOrder}-${screenIndex}`,
  };
};

export const getScreenCustomId = (lessonOrder: number, screenIndex: number) => {
  return `screen-${lessonOrder}-${screenIndex}`;
};
