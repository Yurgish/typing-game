import { Lesson } from '@repo/database';
import { TableCell } from '@repo/ui/components/ui/table';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';

import LessonDialog from './LessonDialog';

const LessonItem = ({ lesson }: { lesson: Lesson }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="tr"
      key={lesson.id}
      value={lesson}
      data-slot="table-row"
      className="select-none"
      dragListener={false}
      dragControls={controls}
    >
      <TableCell>{lesson.order}</TableCell>
      <TableCell>{lesson.title}</TableCell>
      <TableCell>{lesson.screens.length}</TableCell>
      <TableCell>
        <LessonDialog lesson={lesson} />
      </TableCell>
      <TableCell>
        <GripVertical onPointerDown={(e) => controls.start(e)} className="cursor-grab" />
      </TableCell>
    </Reorder.Item>
  );
};

export default LessonItem;
