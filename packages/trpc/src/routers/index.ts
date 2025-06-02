import { router } from "../index";
import { lessonRouter } from "./example";

export const appRouter = router({
  lesson: lessonRouter,
});

export type AppRouter = typeof appRouter;
