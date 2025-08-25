<p align="center">
  <img src="https://github.com/user-attachments/assets/2c80aa68-59e7-49e6-bbe1-1a4692ff7c74" alt="Typing Quest Banner"/>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Turborepo-0C0606?style=for-the-badge&logo=turborepo&logoColor=EF4444" alt="Turborepo">
  <img src="https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="Typescript">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite">
  <img src="https://img.shields.io/badge/zustand-602c3c?style=for-the-badge" alt="Zustand">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node JS">
  <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express JS">
  <img src="https://img.shields.io/badge/Better%20Auth-000000?style=for-the-badge&logo=betterauth&logoColor=white" alt="Better Auth">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma ORM">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

<p align="center">
  A gamified web app for learning touch typing with lessons, real-time metrics, XP, and achievements.  
  Built as my Computer Science diploma project, showcasing clean(ish) architecture and modern full-stack practices (I think ;).    
</p>

---

## 🎥 Little Demo Gif
 ![Animation](https://github.com/user-attachments/assets/f895bfa7-e5b5-4975-9d6c-4402256250eb)


---

## 📑 Table of Contents
1. [Idea & Inspiration](#-idea--inspiration)  
2. [Features](#-features)  
3. [Tech Stack](#-tech-stack)  
4. [Architecture & Structure](#-architecture--structure)  
5. [Showcase](#-showcase)  
6. [Database](#-database)  

---

## 💡 Idea & Inspiration

Somewhere in the middle of my CS degree I realized:  
👉 I still hadn’t learned touch typing (yep, still smashing the keyboard with 2–3 fingers).  

I tried platforms like [**MonkeyType**](https://monkeytype.com/), [**TypingClub**](https://www.typingclub.com/), and [**Keybr**](https://www.keybr.com/). They were cool, but each lacked something.  
So I thought: why not build my own mix with **[Duolingo](https://uk.duolingo.com/)-like streaks, XP, levels, and achievements** combined with typing practice?  

That’s how **Typing Quest** - my little project was born: part personal challenge, part diploma thesis.  

---

## 🛠 Features

- 🧑‍🎓 **Typing Lessons** with different difficulty levels  
- ⌨️ **Highlighted keyboard** (next key + pressed key visualization)  
- 📊 **Metrics**: WPM, accuracy, error tracking, per-character stats  
- 🔥 **Streaks & Heatmap** (like GitHub contribution chart)  
- 🏆 **Achievements & Levels** to keep motivation high  
- 👤 **Auth** (Google & GitHub via Better Auth)  
- 🌓 **Dark / Light theme**  
- 🎉 **Gamification everywhere** (XP, progress, toasts)  

---

## ✨ Tech Stack

### ⚙️ Infrastructure

* **[TypeScript](https://www.typescriptlang.org/)** – Ensures type safety across the entire project, helping prevent errors and improving maintainability. Used in both frontend and backend.
* **[Turborepo](https://turborepo.com/)** – Manages multiple apps and shared packages in a single monorepo. This allows reusing UI components, configurations, and logic efficiently.
* **Shared Configurations (TSConfig, ESLint, Prettier)** – Maintains consistent coding style, formatting, and type checking across all parts of the project.
* **[tRPC](https://trpc.io/)** – Provides a fully type-safe API between frontend and backend. Ideal for monorepo projects where frontend and backend share types.
* **[Zod](https://zod.dev/)** – Validates data at runtime and integrates with tRPC, ensuring that data sent to and received from the server always matches expected types.
* **[Better Auth](https://www.better-auth.com/)** – Handles authentication and authorization simply and securely.

---

### 💻 Frontend

* **[React](https://reactjs.org/)** – Main library for building dynamic, interactive, and component-based user interfaces.
* **[Zustand](https://zustand-demo.pmnd.rs/)** – Lightweight global state management. Used for tracking progress, lesson completion, and UI state efficiently.
* **[TailwindCSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)** – Tailwind provides fast utility-based styling, while Shadcn UI offers prebuilt, customizable components. Together they speed up UI development while keeping a consistent design.
* **[Framer Motion](https://www.framer.com/motion/)** – Used for animations and transitions to make the UI feel smooth and interactive.
* **[Vite](https://vitejs.dev/)** – Fast frontend build tool and development server, providing quick hot-reloading and build performance.

---

### 🖥 Backend

* **[Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)** – Backend runtime and web server framework, providing routing and API endpoints.
* **[Prisma ORM](https://www.prisma.io/)** – Type-safe ORM to interact with the database efficiently and safely.
* **[MongoDB](https://www.mongodb.com/)** – Flexible NoSQL database to store user data, lessons, achievements, and XP logs.

---

## 🏛 Architecture & Structure

Typing Quest is built as a **monorepo** ([Turborepo](https://turborepo.com/)).

### Monorepo Overview

The **monorepo structure** looks like this:

```bash
repo/
├─ apps/                # Main applications
│  ├─ api/              # Backend (Express + TRPC + Prisma)
│  └─ web/              # Frontend (React + Zustand + Tailwind)
├─ packages/            # Shared libraries
│  ├─ database/         # Prisma schemas, DB client, seeding
│  ├─ eslint-config/    # Shared ESLint rules
│  ├─ prettier-config/  # Shared Prettier rules
│  ├─ typescript-config/# Shared TS configs
│  └─ ui/               # Shared UI components (Shadcn-based)
└─ turbo.json           # Turborepo configuration
```

The `apps/` folder contains the main applications: **backend** and **frontend**, while `packages/` holds reusable code such as UI components, TypeScript, Prettier & Eslint configurations and database logic. The `turbo.json` file defines pipelines, caching, and build rules for the monorepo.

---

### 🎨 Frontend (`apps/web`)

The frontend is built with **React** and styled using **TailwindCSS** with **Shadcn UI** components. State management is handled via **Zustand**, and animations are powered by **Framer Motion**.

The folder structure:

```bash
src/
├─ components/          # UI modules (Keyboard, Heatmap, TypingText, Dashboard)
├─ pages/               # Pages (Lessons, Profile, Achievements, Admin)
├─ layouts/             # Layouts (Main, LessonWrapper, ProtectedRoute)
├─ stores/              # Zustand stores (typing, metrics, theme, lesson)
├─ hooks/               # Custom hooks (keyboard, typing, lessons)
├─ lib/                 # Auth, routes, configs
├─ utils/               # Helpers (keyboard, metrics, trpc client)
└─ main.tsx             # App entry
```

Components are small, focused, and reusable blocks like keyboards, progress bars, or lesson text. **Stores** manage global state, such as the current lesson, typing metrics, or theme. **Layouts** provide consistent wrappers for pages, and **utils** contain pure functions without React dependencies.

---

### ⚙️ Backend (`apps/api`)

The backend is structured to separate responsibilities. Core business logic lives in `services`, database interactions are encapsulated in `repositories`, and API endpoints are implemented as **tRPC routers** for fully type-safe client-server communication. The backend also uses an **EventEmitter pattern**. For example when a lesson is completed, events are fired to update user stats, award achievements, and trigger real-time updates via SSE to the frontend if user level or some other specific data changed.

The folder structure:

```bash
src/
├─ core/
│  ├─ dependencies/     # Centralized DI (services, repositories)
│  ├─ events/           # EventEmitter + domain listeners
│  └─ lib/              # Auth, config, context
│
├─ repositories/        # Data access layer (Prisma)
├─ services/            # Business logic (XP, achievements, stats)
├─ routers/             # TRPC routers (API layer)
├─ utils/               # Helpers (xpCalculator, metricsComparator)
├─ types.ts             # Shared backend types
└─ index.ts             # Server entry
```

This separation ensures that each layer is focused on a single responsibility: **repositories** handle data, **services** handle business rules, **routers** expose APIs, and **events** orchestrate reactive updates.

---

## 🖼 Little Showcase

### 👤 Profile & Achievements
Here you can see the **profile page** with overall stats, and the **achievements page** where unlocked badges are displayed.  
</br>

![profile](https://github.com/user-attachments/assets/9d8e29aa-7045-4caa-8e18-601faa03191d)

---

### ⌨️ Taking a Lesson (Light difficulty)
A quick demo of completing the **second lesson** on the *Easy* level — with real-time metrics, highlighted keyboard, and progress tracking.  
</br>

![lesson2](https://github.com/user-attachments/assets/cd0fc924-e749-40ae-9d91-cd910eee3868)

---

### 🌗 Dark ↔ Light Theme
And here’s the same **lesson #2**, but in **light theme**, showing that the whole UI is theme-aware.  
</br>

![lesson3](https://github.com/user-attachments/assets/52163486-6b40-4b7e-a3da-62cd95fc84e0)

---

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:5000](http://localhost:5000)

---
