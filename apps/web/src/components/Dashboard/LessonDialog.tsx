import { Lesson } from '@repo/database';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@repo/ui/components/ui/dialog';

interface LessonDialogProps {
  lesson: Lesson;
}

const LessonDialog = ({ lesson }: LessonDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-base">
          View
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal">
            {lesson.order}. {lesson.title}
          </DialogTitle>
          <DialogDescription className="text-base">ID: {lesson.id}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDialog;
