import { PrismaClient, LessonDifficulty, LearningMode } from "@repo/database";

const prisma = new PrismaClient();

async function seedLessons() {
  const lessonsToCreate = [
    {
      title: "S and L",
      difficulty: LessonDifficulty.BEGINNER,
      order: 4,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyS" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "ssssssssssssssssss" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyL" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "llllllllllllllllll" },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "s l ss ll sl ls ssl lls sls lsl ssss llll sllsl sl sll lsl lsll",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "f j d k s l fj dk sl ds lk sf lj fs jl" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "jsld klsd dslk slkj lskj sldj klds jkls" },
          order: 7,
        },
      ],
    },
    {
      title: "A and semicolon",
      difficulty: LessonDifficulty.BEGINNER,
      order: 5,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyA" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "aaaaaaaaaaaaaaaaaa" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "Semicolon" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: ";;;;;;;;;;;;;;;;;;" },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "a ; aa ;; a; ;a aa; ;;a a;a ;a; aaaa ;;;; a;;a; a; a;; ;a; ;a;;",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "a s d f j k l ; as df jk l; aj sk dl f; ja ks ld ;f",
          },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "asdf jkl; ajfkd;ls ladskf; asldfkjasd;lfkja" },
          order: 7,
        },
      ],
    },
    {
      title: "Review: Home Row",
      difficulty: LessonDifficulty.BEGINNER,
      order: 6,
      screens: [
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "asdf jkl; asdfjkl; asdf jkl; asdfjkl; fj dk sl a;",
          },
          order: 1,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "ad;flk sj;afk alsdkfjalksdjflkadjflk ajdskf;lajsdflkajsdfl;",
          },
          order: 2,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "fjdksla; adsf jkl; asdf jkl; asdf jkl; ajfkd;ls" },
          order: 3,
        },
      ],
    },
    {
      title: "E and I",
      difficulty: LessonDifficulty.BEGINNER,
      order: 7,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyE" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "eeeeeeeeeeeeeeeeee" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyI" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "iiiiiiiiiiiiiiiiii" },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "e i ee ii ei ie eei iie eie iei eeee iiii eiiei ei eii iei ieii",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "de ki se li fe ji ed ik es il ef ij" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "slide like idle file life side ride if" },
          order: 7,
        },
      ],
    },
    {
      title: "R and U",
      difficulty: LessonDifficulty.BEGINNER,
      order: 8,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyR" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "rrrrrrrrrrrrrrrrrr" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyU" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "uuuuuuuuuuuuuuuuuu" },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "r u rr uu ru ur rru uur rur uru rrrr uuuu ruuru ru ruu uru uruu",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "fr ju dr ku er iu re uj rd uk ie ui" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "true rule cure rude lure sure fire pure" },
          order: 7,
        },
      ],
    },
    {
      title: "Review: Top Row (Middle)",
      difficulty: LessonDifficulty.BEGINNER,
      order: 9,
      screens: [
        {
          type: LearningMode.DEFAULT,
          content: { text: "e r u i re ui er iu ru ei ur ie" },
          order: 1,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "red rut tie ire due true fire iure" },
          order: 2,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "fjei drku asui rdel jkui;f asdfer" },
          order: 3,
        },
      ],
    },
    {
      title: "T and O",
      difficulty: LessonDifficulty.BEGINNER,
      order: 10,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyT" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "tttttttttttttttttt" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyO" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "oooooooooooooooooo" },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "t o tt oo to ot tto oot oto tot tttt oooo tooto to too oto otoo",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "ft jo dt ko st lo rt uo et io ro tu" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "root took foot toor lot toor too rot" },
          order: 7,
        },
      ],
    },
    {
      title: "W and P",
      difficulty: LessonDifficulty.BEGINNER,
      order: 11,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyW" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "wwwwwwwwwwwwwwwwww" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyP" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "pppppppppppppppppp" },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "w p ww pp wp pw wwp ppw wpw pwp wwww pppp wpwpm wp wpp pwp wpwp",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "sw lp dw kp fw jp lw sp ew ip wo pe" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "power write swipe type new pool wire" },
          order: 7,
        },
      ],
    },
    {
      title: "Review: Top Row (Full)",
      difficulty: LessonDifficulty.BEGINNER,
      order: 12,
      screens: [
        {
          type: LearningMode.DEFAULT,
          content: { text: "qwert yuiop qwertyuiop qwertyuiop" },
          order: 1,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "qwerty yuiop asdfg hjkl; zxcvb nm,./" },
          order: 2,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "tree power water type open write pure" },
          order: 3,
        },
      ],
    },
    {
      title: "C and Comma",
      difficulty: LessonDifficulty.BEGINNER,
      order: 13,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyC" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "cccccccccccccccccc" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "Comma" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: ",,,,,,,,,,,,,,,,,,", order: 4 },
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "c , cc ,, c, ,c cc, ,,c c,c ,c, cccc ,,,, c,,c, c, c,, ,c, ,c,,",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "dc kc sc lc vc mc nc bc rc tc yc ic oc pc" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "come nice once race calm care rice place" },
          order: 7,
        },
      ],
    },
    {
      title: "V and M",
      difficulty: LessonDifficulty.BEGINNER,
      order: 14,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyV" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "vvvvvvvvvvvvvvvvvv" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyM" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "mmmmmmmmmmmmmmmmmm" },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "v m vv mm vm mv vvm mmv vmv mvm vvvv mmmm vmvmv vm vmm mvm vmvm",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "fv jm dv km sv lm av ;m rv um ev im" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "move live very much even have some" },
          order: 7,
        },
      ],
    },
    {
      title: "Review: Bottom Row (Middle)",
      difficulty: LessonDifficulty.BEGINNER,
      order: 15,
      screens: [
        {
          type: LearningMode.DEFAULT,
          content: { text: "c v m , cv m, cm v, vc ,m mv ,c" },
          order: 1,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "come move cover value time love many" },
          order: 2,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "asdfcvb nm,.;lkj asdfg hjkl; cvbnm,." },
          order: 3,
        },
      ],
    },
    {
      title: "X and Period",
      difficulty: LessonDifficulty.BEGINNER,
      order: 16,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyX" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "xxxxxxxxxxxxxxxxxx" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "Period" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: ".................." },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "x . xx .. x. .x xx. ..x x.x .x. xxxx .... x..x. x. x.. .x. .x..",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "dx kx sx lx cx mx nx bx rx tx yx ix ox px" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "box fox tax fix mix next exit fax lax" },
          order: 7,
        },
      ],
    },
    {
      title: "Z and Slash",
      difficulty: LessonDifficulty.BEGINNER,
      order: 17,
      screens: [
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "KeyZ" },
          order: 1,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "zzzzzzzzzzzzzzzzzz" },
          order: 2,
        },
        {
          type: LearningMode.KEY_INTRODUCTION,
          content: { keyCode: "Slash" },
          order: 3,
        },
        {
          type: LearningMode.LETTER_SEQUENCE,
          content: { sequence: "//////////////////" },
          order: 4,
        },
        {
          type: LearningMode.DEFAULT,
          content: {
            text: "z / zz // z/ /z zz/ //z z/z /z/ zzzz //// z//z/ z/ z// /z/ /z//",
          },
          order: 5,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "az ;z sz lz xz mz cz vz rz tz yz iz oz pz" },
          order: 6,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "lazy haze maze craze size buzz fizz jazz" },
          order: 7,
        },
      ],
    },
    {
      title: "Review: Bottom Row (Full)",
      difficulty: LessonDifficulty.BEGINNER,
      order: 18,
      screens: [
        {
          type: LearningMode.DEFAULT,
          content: { text: "zxcvb nm,./ zxcvbnm,./ zxcvbnm,./" },
          order: 1,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "zebra exit maze lazy quiz pizza crazy" },
          order: 2,
        },
        {
          type: LearningMode.DEFAULT,
          content: { text: "asdfghjkl;' zxcvbnm,./ asdfg zxcvb" },
          order: 3,
        },
      ],
    },
  ];

  for (const lessonData of lessonsToCreate) {
    const existingLesson = await prisma.lesson.findFirst({
      where: { title: lessonData.title },
    });

    if (!existingLesson) {
      await prisma.lesson.create({
        data: {
          title: lessonData.title,
          difficulty: lessonData.difficulty,
          order: lessonData.order,
          screens: lessonData.screens.map((screen) => ({
            type: screen.type,
            content: {
              keyCode: screen.content?.keyCode,
              sequence: screen.content?.sequence,
              text: screen.content?.text,
            },
            order: screen.order ?? 0,
          })),
        },
      });
      console.log(`Lesson "${lessonData.title}" created.`);
    } else {
      console.log(`Lesson "${lessonData.title}" already exists, skipping.`);
    }
  }

  console.log("Lesson seeding completed.");
}

seedLessons()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
