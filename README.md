# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

```
Dyploma
├─ .npmrc
├─ apps
│  ├─ api
│  │  ├─ .prettierrc.cjs
│  │  ├─ eslint.config.js
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ index.ts
│  │  │  └─ lib
│  │  │     ├─ auth.ts
│  │  │     └─ config.ts
│  │  └─ tsconfig.json
│  └─ web
│     ├─ .prettierrc.js
│     ├─ eslint.config.js
│     ├─ index.html
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  ├─ favicon.ico
│     │  └─ fonts
│     │     └─ VCR_OSD_MONO_1.001.ttf
│     ├─ README.md
│     ├─ src
│     │  ├─ App.tsx
│     │  ├─ components
│     │  │  ├─ Keyboard
│     │  │  │  ├─ Arrows.tsx
│     │  │  │  ├─ index.tsx
│     │  │  │  ├─ Key.tsx
│     │  │  │  ├─ keyboardLabels.ts
│     │  │  │  ├─ keyboardLayouts.ts
│     │  │  │  └─ specialKeyStyles.ts
│     │  │  ├─ KeyIntroduction
│     │  │  │  └─ index.tsx
│     │  │  ├─ LessonCard.tsx
│     │  │  ├─ LoginButton.tsx
│     │  │  ├─ ProgressBar.tsx
│     │  │  ├─ RealTimeMetrics.tsx
│     │  │  ├─ SequenceOfLetters
│     │  │  │  └─ index.tsx
│     │  │  ├─ SignButton
│     │  │  │  └─ index.tsx
│     │  │  ├─ ThemeToggle.tsx
│     │  │  └─ TypingText
│     │  │     ├─ Caret.tsx
│     │  │     ├─ Character.tsx
│     │  │     ├─ index.tsx
│     │  │     └─ Word.tsx
│     │  ├─ config
│     │  │  └─ keyboardShortcuts.ts
│     │  ├─ hooks
│     │  │  ├─ useKeyboardHandler.ts
│     │  │  ├─ useLessonsScreensHandler.ts
│     │  │  ├─ useSaveProgress.ts
│     │  │  └─ useTypingHandler.ts
│     │  ├─ layouts
│     │  │  └─ MainLayout.tsx
│     │  ├─ lib
│     │  │  ├─ auth.ts
│     │  │  ├─ config.ts
│     │  │  └─ constansts.ts
│     │  ├─ main.tsx
│     │  ├─ pages
│     │  │  ├─ Lesson.tsx
│     │  │  ├─ LessonResults.tsx
│     │  │  ├─ Lessons.tsx
│     │  │  ├─ LessonScreen.tsx
│     │  │  └─ Profile.tsx
│     │  ├─ stores
│     │  │  ├─ useCurrentLessonStore.ts
│     │  │  ├─ useKeyboardStore.ts
│     │  │  ├─ useThemeStore.ts
│     │  │  ├─ useTypingMetricsStore.ts
│     │  │  └─ useTypingStore.ts
│     │  ├─ utils
│     │  │  ├─ keyboard.ts
│     │  │  ├─ localStorage.ts
│     │  │  ├─ metrics.ts
│     │  │  ├─ transformation.ts
│     │  │  ├─ trpc.ts
│     │  │  └─ types.ts
│     │  └─ vite-env.d.ts
│     ├─ tailwind.config.ts
│     ├─ tsconfig.app.json
│     ├─ tsconfig.json
│     ├─ tsconfig.node.json
│     └─ vite.config.ts
├─ package-lock.json
├─ package.json
├─ packages
│  ├─ database
│  │  ├─ .prettierrc.cjs
│  │  ├─ package.json
│  │  ├─ prisma
│  │  │  └─ schema
│  │  │     ├─ auth.prisma
│  │  │     ├─ base.prisma
│  │  │     ├─ lesson.prisma
│  │  │     └─ progress.prisma
│  │  ├─ seed.ts
│  │  ├─ src
│  │  │  ├─ config.ts
│  │  │  ├─ generated
│  │  │  │  └─ client
│  │  │  │     ├─ client.ts
│  │  │  │     ├─ commonInputTypes.ts
│  │  │  │     ├─ enums.ts
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ internal
│  │  │  │     │  ├─ class.ts
│  │  │  │     │  └─ prismaNamespace.ts
│  │  │  │     ├─ models
│  │  │  │     │  ├─ Account.ts
│  │  │  │     │  ├─ CharacterMetric.ts
│  │  │  │     │  ├─ Content.ts
│  │  │  │     │  ├─ Lesson.ts
│  │  │  │     │  ├─ Screen.ts
│  │  │  │     │  ├─ ScreenMetrics.ts
│  │  │  │     │  ├─ Session.ts
│  │  │  │     │  ├─ User.ts
│  │  │  │     │  ├─ UserAchievement.ts
│  │  │  │     │  ├─ UserDailyActivity.ts
│  │  │  │     │  ├─ UserLessonProgress.ts
│  │  │  │     │  ├─ UserStats.ts
│  │  │  │     │  └─ Verification.ts
│  │  │  │     ├─ models.ts
│  │  │  │     └─ query_engine-windows.dll.node
│  │  │  └─ index.ts
│  │  └─ tsconfig.json
│  ├─ eslint-config
│  │  ├─ base.js
│  │  ├─ express.js
│  │  ├─ package.json
│  │  └─ react.js
│  ├─ prettier-config
│  │  ├─ index.js
│  │  └─ package.json
│  ├─ trpc
│  │  ├─ eslint.config.js
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ constants
│  │  │  │  └─ achievements.ts
│  │  │  ├─ context.ts
│  │  │  ├─ index.ts
│  │  │  ├─ routers
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ lessons.ts
│  │  │  │  └─ userProgress.ts
│  │  │  ├─ services
│  │  │  │  ├─ AchievementService.ts
│  │  │  │  ├─ DailyActivityService.ts
│  │  │  │  ├─ LessonProgressService.ts
│  │  │  │  └─ UserStatsService.ts
│  │  │  ├─ types.ts
│  │  │  └─ utils
│  │  │     ├─ metricsComparator.ts
│  │  │     └─ xpCalculator.ts
│  │  └─ tsconfig.json
│  ├─ typescript-config
│  │  ├─ base.json
│  │  ├─ package.json
│  │  ├─ react-library.json
│  │  └─ react.json
│  └─ ui
│     ├─ components.json
│     ├─ eslint.config.js
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ src
│     │  ├─ components
│     │  │  └─ ui
│     │  │     ├─ alert.tsx
│     │  │     ├─ avatar.tsx
│     │  │     ├─ badge.tsx
│     │  │     ├─ button.tsx
│     │  │     ├─ card.tsx
│     │  │     ├─ carousel.tsx
│     │  │     ├─ dialog.tsx
│     │  │     ├─ hover-card.tsx
│     │  │     └─ tabs.tsx
│     │  ├─ globals.css
│     │  └─ lib
│     │     └─ utils.ts
│     └─ tsconfig.json
├─ README.md
└─ turbo.json

```