import LessonCard from "@/components/LessonCard";

export type Lesson = {
  id: string;
  title: string;
  screens: Screen[];
};

export type Screen = {
  id: string;
  type: LearningModes;
  content: Content;
};

export enum LearningModes {
  KEY_INTRODUCTION = "KEY_INTRODUCTION",
  LETTER_SEQUENCE = "LETTER_SEQUENCE",
  DEFAULT = "DEFAULT",
}

export type Content = {
  keyCode?: string;
  sequence?: string;
  text?: string;
};

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "J, F, and Space",
    screens: [
      { id: "screen-1-1", type: LearningModes.KEY_INTRODUCTION, content: { keyCode: "KeyJ" } },
      { id: "screen-1-2", type: LearningModes.LETTER_SEQUENCE, content: { sequence: "jjjjjjjjjjjjjjjjjj" } },
      { id: "screen-1-3", type: LearningModes.KEY_INTRODUCTION, content: { keyCode: "KeyF" } },
      { id: "screen-1-4", type: LearningModes.LETTER_SEQUENCE, content: { sequence: "ffffffffffffffffff" } },
      {
        id: "screen-1-5",
        type: LearningModes.LETTER_SEQUENCE,
        content: { sequence: "jjffjjfffffjjffjfjjfjjfjfjfjjjjjfffjfjffjjf" },
      },
      { id: "screen-1-6", type: LearningModes.KEY_INTRODUCTION, content: { keyCode: "Space" } },
      {
        id: "screen-1-7",
        type: LearningModes.LETTER_SEQUENCE,
        content: { sequence: "j f fj jf jj  fff fjj  fjj fj f jf j ff jf jfjfjfj  fffjj fj   jf" },
      },
      {
        id: "screen-1-8",
        type: LearningModes.DEFAULT,
        content: { text: "f j ff jj fj jf ffj jjf fjf jfj ffff jjjj fjjfj fj fjj jfj jfjj" },
      },
    ],
  },
  {
    id: "lesson-2",
    title: "D and K",
    screens: [
      { id: "screen-2-1", type: LearningModes.KEY_INTRODUCTION, content: { keyCode: "KeyD" } },
      { id: "screen-2-2", type: LearningModes.LETTER_SEQUENCE, content: { sequence: "dddddddddddddddddd" } },
      { id: "screen-2-3", type: LearningModes.LETTER_SEQUENCE, content: { sequence: "d d dd dd dd ddd dddd dd d" } },
      { id: "screen-2-4", type: LearningModes.KEY_INTRODUCTION, content: { keyCode: "KeyK" } },
      { id: "screen-2-5", type: LearningModes.LETTER_SEQUENCE, content: { sequence: "kkkkkkkkkkkkkkkkkk" } },
      { id: "screen-2-6", type: LearningModes.LETTER_SEQUENCE, content: { sequence: "k kk kkk kk kk kk kkk kkk" } },
      {
        id: "screen-2-7",
        type: LearningModes.LETTER_SEQUENCE,
        content: { sequence: "ddkkddkkkkddkkdkkddkdkdkdkkdkkkdkdkdkdkkdd" },
      },
      {
        id: "screen-2-8",
        type: LearningModes.DEFAULT,
        content: { text: "d k dd kk dk kd dkk kkd kdd kkk ddd ddk kdk kkkd dkd kdk dkdkdk" },
      },
      {
        id: "screen-2-9",
        type: LearningModes.DEFAULT,
        content: {
          text: "ddd ddk kdk kkkd dkd kdk dkdkdk d k dd kk dk kd dkk kkd kdd kkk ddd ddk kdk kkkd dkd kdk dkdkdk",
        },
      },
    ],
  },
  {
    id: "lesson-3",
    title: "Review: All Learned Keys",
    screens: [
      {
        id: "screen-3-1",
        type: LearningModes.LETTER_SEQUENCE,
        content: { sequence: "jf dk j f d k jj ff dd kk jf dk jfj dkf dfk fjk jdf kd j f d k" },
      },
      {
        id: "screen-3-2",
        type: LearningModes.DEFAULT,
        content: {
          text: "jf dk j f d k jj ff dd kk jf dk jfj dkf dfk fjk jdf kd j f d k jf dk jfj dkf dfk fjk jdf kd j f d k",
        },
      },
      {
        id: "screen-3-3",
        type: LearningModes.DEFAULT,
        content: {
          text: "jf dk j f d k jj ff dd kk jf dk jfj dkf dfk fjk jdf kd j f d k jf dk jfj dkf dfk fjk jdf kd j f d k",
        },
      },
    ],
  },
];

const Lessons = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <ul className="flex flex-col gap-4">
        {lessons.map((lesson, index) => (
          <LessonCard key={lesson.id} lesson={lesson} index={index} />
        ))}
      </ul>
    </div>
  );
};

export default Lessons;
