<p align="center">
  <img src="https://github.com/user-attachments/assets/2c80aa68-59e7-49e6-bbe1-1a4692ff7c74" alt="Typing Quest Banner"/>
</p>
<p align = "center">
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
  A gamified web platform for learning touch typing with lessons, real-time metrics, XP, and achievements.  
  Built as my Computer Science diploma project, showcasing clean(ish) architecture and modern full-stack practices (I think ;).    
</p>

---

## 🎥 Demo
*(insert a GIF here — e.g. typing lesson in action)*  

---

## 📑 Table of Contents
1. [Idea & Inspiration](#-idea--inspiration)  
2. [Features](#-features)  
3. [Tech Stack](#-tech-stack)  
4. [Architecture & Structure](#-architecture--structure)  
5. [Showcase](#-showcase)  
6. [Run Locally](#-run-locally)  

---

## 💡 Idea & Inspiration

Somewhere in the middle of my CS degree I realized:  
👉 I still hadn’t learned touch typing (yep, still smashing the keyboard with 2–3 fingers).  

I tried platforms like **MonkeyType**, **TypingClub**, and **Keybr**. They were cool, but each lacked something.  
So I thought: why not build my own mix — with **Duolingo-like streaks, XP, levels, and achievements** combined with typing practice?  

That’s how **Typing Quest** was born: part personal challenge, part diploma thesis.  

---

## ✨ Features

- 🧑‍🎓 **Typing Lessons** with different difficulty levels  
- ⌨️ **Highlighted keyboard** (next key + pressed key visualization)  
- 📊 **Metrics**: WPM, accuracy, error tracking, per-character stats  
- 🔥 **Streaks & Heatmap** (like GitHub contribution chart)  
- 🏆 **Achievements & Levels** to keep motivation high  
- 👤 **Auth** (Google & GitHub via Better Auth)  
- 🌓 **Dark / Light theme**  
- 🎉 **Gamification everywhere** (XP, progress, toasts)  

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript  
- Zustand (state management)  
- TailwindCSS + Shadcn UI (UI components)  
- Framer Motion (animations)  
- TRPC client (type-safe API calls)  
- Vite  

### Backend
- Node.js + Express  
- TRPC (type-safe API layer)  
- Prisma ORM + MongoDB  
- EventEmitter (for service communication & SSE events)  
- Repository & Service pattern  

### Infra
- Monorepo with **Turborepo**  
- Shared UI, config, eslint, prettier  
- Better Auth for authentication  

---

## 🏛 Architecture & Structure

Typing Quest is a **monorepo** with Turborepo.

### Monorepo overview
```bash
Dyploma/
├─ apps/           # Main apps
│  ├─ api/         # Backend (Express + TRPC + Prisma)
│  └─ web/         # Frontend (React + Zustand + Tailwind)
├─ packages/       # Shared libraries (db, ui, configs)
└─ turbo.json
````

### Frontend structure (`apps/web`)

```bash
src/
├─ components/     # UI modules (Keyboard, HeatMap, TypingText...)
├─ pages/          # Lessons, Profile, Achievements, Results
├─ stores/         # Zustand stores (typing, metrics, theme)
├─ hooks/          # Custom hooks
└─ utils/          # Helpers (keyboard, metrics, trpc client)
```

*(Architecture note: kept modular, grouped by feature. Nothing over-engineered.)*

### Backend structure (`apps/api`)

```bash
src/
├─ repositories/   # Database access
├─ services/       # Business logic
├─ routers/        # TRPC routers (API layer)
├─ shared/         # EventEmitter (internal events)
└─ utils/          # XP calculator, metrics comparator
```

*(Architecture note: a 3-layer approach → Repository (DB) → Service (business logic) → Router (API). Plus EventEmitter for internal comms & SSE events.)*

---

## 🖼 Showcase

*(place here extra GIFs/screenshots, e.g.):*

* Unlocking achievements
* Achievements page
* Profile with stats
* Daily activity heatmap

---

## 🚀 Run Locally

### Prerequisites

* Node.js >= 18
* pnpm (recommended)
* MongoDB running locally

### Install & run

```bash
git clone https://github.com/yourusername/typing-quest.git
cd typing-quest
pnpm install
```

### Setup environment

Create `.env` in `apps/api`:

```env
DATABASE_URL="mongodb://localhost:27017/typing"
AUTH_SECRET="super_secret"
GOOGLE_CLIENT_ID="..."
GITHUB_CLIENT_ID="..."
```

### Run dev

```bash
pnpm dev
```

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:5000](http://localhost:5000)

---
