import { Lesson } from '@repo/database';
import { Button } from '@repo/ui/components/ui/button';
import { Table, TableCaption, TableFooter, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import LessonItem from '@web/components/Dashboard/LessonItem';
import { trpc } from '@web/utils/trpc';
import { LessonDifficulty } from '@web/utils/types';
import { Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';

export const AdminDashboard = () => {
  const [difficulty, setDifficulty] = useState<LessonDifficulty>(LessonDifficulty.BEGINNER);

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const { data: fetchedLessons, isLoading: isLoadingLessons } = useQuery({
    ...trpc.lesson.getByDifficulty.queryOptions({ difficulty }),
    staleTime: 1000 * 60 * 10
  });

  useEffect(() => {
    if (fetchedLessons || !isLoadingLessons) setLessons(fetchedLessons ?? []);
  }, [fetchedLessons, isLoadingLessons]);

  const cancelChangesHandler = () => {
    setLessons(fetchedLessons ?? []);
  };

  return (
    <div className="h-full max-h-screen py-40">
      <Tabs
        className="mb-6 flex w-full items-center justify-center"
        defaultValue={difficulty}
        value={difficulty}
        onValueChange={(value) => setDifficulty(value as LessonDifficulty)}
      >
        <TabsList>
          <TabsTrigger value={LessonDifficulty.BEGINNER}>BEGINNER</TabsTrigger>
          <TabsTrigger value={LessonDifficulty.INTERMEDIATE}>INTERMEDIATE</TabsTrigger>
          <TabsTrigger value={LessonDifficulty.ADVANCED}>ADVANCED</TabsTrigger>
        </TabsList>
      </Tabs>
      {isLoadingLessons ? (
        <div>Loading lessons...</div>
      ) : (
        <div className="no-scrollbar mask-fade-vertical h-[600px] overflow-y-auto py-5">
          <Table className="text-base">
            <TableCaption>List of {difficulty} lessons</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Screens</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <Reorder.Group as="tbody" axis="y" values={lessons ?? []} onReorder={setLessons}>
              {lessons?.map((lesson) => <LessonItem key={lesson.id} lesson={lesson} />)}
            </Reorder.Group>

            <TableFooter />
          </Table>
        </div>
      )}
      {lessons !== fetchedLessons && <Button onClick={cancelChangesHandler}>Cancel Changes</Button>}
    </div>
  );
};
