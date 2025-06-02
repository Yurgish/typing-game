import { router } from "../index";
import { lessonRouter } from "./lessons";

export const appRouter = router({
  lesson: lessonRouter,
});

export type AppRouter = typeof appRouter;
