import { Button } from "@repo/ui/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@repo/ui/components/ui/hover-card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

import { Lesson } from "@/pages/Lessons";
import { useScreenLinkStore } from "@/stores/useScreenLinkStore";

const LessonCard = ({ lesson, index }: { lesson: Lesson; index: number }) => {
  const navigate = useNavigate();
  const { setCurrentLink } = useScreenLinkStore();

  const navigateToScreen = (screenId: string) => {
    setCurrentLink({ lessonId: lesson.id, screenId });
    navigate(`/lesson/${lesson.id}`);
  };

  return (
    <div className="border-border w-[700px] overflow-hidden rounded-md border-2 transition-all duration-200 hover:shadow-(--key-shadow)">
      <div className="border-background h-full w-full overflow-hidden rounded-md border-2">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-base">
            {index + 1}. {lesson.title}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/lesson/${lesson.id}`)}>
            Start
          </Button>
        </div>
        <div className="flex w-full gap-1">
          {lesson.screens.map((screen) => (
            <HoverCard key={screen.id}>
              <motion.div
                className="bg-foreground h-1 cursor-pointer"
                whileHover={{ scaleY: 2, flex: 1.1 }}
                initial={{ scaleY: 1, flex: 1 }}
                onClick={() => navigateToScreen(screen.id)}
              >
                <HoverCardTrigger className="flex h-full w-full"></HoverCardTrigger>
              </motion.div>
              <HoverCardContent className="w-full px-4 py-2 text-xs">
                <p>{screen.id}</p>
                <p>Mode: {screen.type}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
