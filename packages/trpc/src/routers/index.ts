import { router } from "../index";
import { lessonRouter } from "./lessons";
import { userProgressRouter } from "./userProgress";

export const appRouter = router({
  lesson: lessonRouter,
  userProgress: userProgressRouter,
});

export type AppRouter = typeof appRouter;
