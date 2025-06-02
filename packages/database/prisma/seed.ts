// prisma/seed.ts (або src/db/seed.ts)
import { PrismaClient, LearningMode, LessonDifficulty } from "../generated/client/client";

// Ви можете перенести цей об'єкт уроків сюди або імпортувати його
// Якщо він у вас у файлі типу `src/data/lessonsData.ts`, то:
// import { lessons as initialLessonsData } from '../src/data/lessonsData';
// Для прикладу, я залишаю його тут.

interface OldLesson {
  id: string; // Це буде ігноруватися Prisma, оскільки MongoDB генерує свій _id
  title: string;
  screens: OldScreen[];
}

interface OldScreen {
  id: string; // Це буде ігноруватися
  type: string; // Буде приведено до LearningMode
  content: {
    keyCode?: string;
    sequence?: string;
    text?: string;
  };
}

// Ваш вихідний об'єкт уроків
const initialLessonsData: OldLesson[] = [
  {
    id: "lesson-1",
    title: "J, F, and Space",
    screens: [
      { id: "screen-1-1", type: "KEY_INTRODUCTION", content: { keyCode: "KeyJ" } },
      { id: "screen-1-2", type: "LETTER_SEQUENCE", content: { sequence: "jjjjjjjjjjjjjjjjjj" } },
      { id: "screen-1-3", type: "KEY_INTRODUCTION", content: { keyCode: "KeyF" } },
      { id: "screen-1-4", type: "LETTER_SEQUENCE", content: { sequence: "ffffffffffffffffff" } },
      {
        id: "screen-1-5",
        type: "LETTER_SEQUENCE",
        content: { sequence: "jjffjjfffffjjffjfjjfjjfjfjfjjjjjfffjfjffjjf" },
      },
      { id: "screen-1-6", type: "KEY_INTRODUCTION", content: { keyCode: "Space" } },
      {
        id: "screen-1-7",
        type: "LETTER_SEQUENCE",
        content: { sequence: "j f fj jf jj   fff fjj   fjj fj f jf j ff jf jfjfjfj   fffjj fj    jf" },
      },
      {
        id: "screen-1-8",
        type: "DEFAULT",
        content: { text: "f j ff jj fj jf ffj jjf fjf jfj ffff jjjj fjjfj fj fjj jfj jfjj" },
      },
    ],
  },
  {
    id: "lesson-2",
    title: "D and K",
    screens: [
      { id: "screen-2-1", type: "KEY_INTRODUCTION", content: { keyCode: "KeyD" } },
      { id: "screen-2-2", type: "LETTER_SEQUENCE", content: { sequence: "dddddddddddddddddd" } },
      { id: "screen-2-3", type: "LETTER_SEQUENCE", content: { sequence: "d d dd dd dd ddd dddd dd d" } },
      { id: "screen-2-4", type: "KEY_INTRODUCTION", content: { keyCode: "KeyK" } },
      { id: "screen-2-5", type: "LETTER_SEQUENCE", content: { sequence: "kkkkkkkkkkkkkkkkkk" } },
      { id: "screen-2-6", type: "LETTER_SEQUENCE", content: { sequence: "k kk kkk kk kk kk kkk kkk" } },
      {
        id: "screen-2-7",
        type: "LETTER_SEQUENCE",
        content: { sequence: "ddkkddkkkkddkkdkkddkdkdkdkkdkkkdkdkdkdkkdd" },
      },
      {
        id: "screen-2-8",
        type: "DEFAULT",
        content: { text: "d k dd kk dk kd dkk kkd kdd kkk ddd ddk kdk kkkd dkd kdk dkdkdk" },
      },
      {
        id: "screen-2-9",
        type: "DEFAULT",
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
        type: "LETTER_SEQUENCE",
        content: { sequence: "jf dk j f d k jj ff dd kk jf dk jfj dkf dfk fjk jdf kd j f d k" },
      },
      {
        id: "screen-3-2",
        type: "DEFAULT",
        content: {
          text: "jf dk j f d k jj ff dd kk jf dk jfj dkf dfk fjk jdf kd j f d k jf dk jfj dkf dfk fjk jdf kd j f d k",
        },
      },
      {
        id: "screen-3-3",
        type: "DEFAULT",
        content: {
          text: "jf dk j f d k jj ff dd kk jf dk jfj dkf dfk fjk jdf kd j f d k jf dk jfj dkf dfk fjk jdf kd j f d k",
        },
      },
    ],
  },
];

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  //Очистка існуючих уроків перед додаванням нових (опціонально, корисно для розробки)
  await prisma.lesson.deleteMany({});
  console.log("Cleared existing lessons.");

  for (let i = 0; i < initialLessonsData.length; i++) {
    const lesson = initialLessonsData[i];
    const lessonOrder = i + 1; // Просто присвоюємо порядковий номер за індексом

    // Присвоюємо складність. Можете адаптувати цю логіку, якщо у вас є інші критерії.
    let difficulty: LessonDifficulty = LessonDifficulty.BEGINNER;

    const screensToCreate = lesson.screens.map((screen, screenIndex) => ({
      // Поле `id` у `Screen` не потрібне в Prisma для `type` (вбудованих документів)
      // Його не буде в MongoDB. Якщо вам потрібно посилатися на Screen,
      // це робитиметься через індекс у масиві Lesson.screens
      type: screen.type as LearningMode, // Приводимо до Prisma Enum
      content: screen.content,
      order: screenIndex + 1, // Присвоюємо порядковий номер екрану
    }));

    await prisma.lesson.create({
      data: {
        title: lesson.title,
        difficulty: difficulty,
        order: lessonOrder,
        screens: screensToCreate,
      },
    });
    console.log(`Created lesson: "${lesson.title}" with order ${lessonOrder}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
