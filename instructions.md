# Ruslan Next.js CV (EN/UA) — Copilot Instructions

Цей репозиторій — двомовний CV-сайт (EN/UA) на Next.js App Router з Tailwind CSS і темами Catppuccin (Latte/Mocha).
Сайт має сторінки `/en` і `/ua`, перемикач теми (Latte ↔ Mocha), блок GitHub-статистики, “Tailored summary” (stub) і сторінку для друку/збереження у PDF: `/cv/pdf?lang=en|ua`.

## Tech stack (Стек)
- **Framework:** Next.js (App Router)
- **UI:** React + TypeScript (strict)
- **Styling:** Tailwind CSS
- **Theme:** Catppuccin через CSS variables (Latte за замовчуванням, Mocha в `.dark`)
- **Routing:** `/en`, `/ua`, `/cv/pdf`
- **No backend**, **no DB**, **no env vars** (станом на зараз)
- **GitHub stats:** images з github-readme-stats (без API ключів)

## Coding guidelines (Рекомендації)
- Пиши **TypeScript строго**, без `any` (якщо дуже треба — створюй тип/інтерфейс).
- За замовчуванням компоненти — **Server Components**. Додавай `"use client"` тільки якщо:
  - потрібен state/effect, доступ до `window/localStorage`, event handlers.
- Дотримуйся **існуючих патернів** компонентів:
  - секції оформлюємо через `src/components/Section.tsx`
  - бейджі через `src/components/Badge.tsx`
  - проєкти через `src/components/ProjectCard.tsx`
- Стилі:
  - використовуй Tailwind-класи та дизайн-токени (кольори через `bg-base`, `text-text`, `text-subtext`, `border-border`, `bg-mantle`, `bg-surface`, `bg-accent`)
  - **не** хардкодь Catppuccin HEX у компонентах (вони живуть у CSS vars у `src/app/globals.css`)
- A11y:
  - кнопки мають `type="button"`, meaningful aria-label (де треба)
  - не ламай контрастність при темі
- Тримай EN/UA синхронно: якщо додаєш нову секцію/поле — додавай в **обидві** мови.

## Project structure (Структура)
- `src/app/layout.tsx` — кореневий layout, підключення `ThemeProvider`, глобальні стилі
- `src/app/globals.css` — Tailwind + Catppuccin variables (Latte/Mocha)
- `src/app/page.tsx` — редірект на `/en`
- `src/app/en/page.tsx` — EN сторінка CV
- `src/app/ua/page.tsx` — UA сторінка CV
- `src/app/cv/pdf/page.tsx` — print/PDF сторінка (параметр `lang`)
- `src/app/robots.ts`, `src/app/sitemap.ts` — SEO (важливо: онови `base` у sitemap під свій домен)
- `src/data/cv.en.ts`, `src/data/cv.ua.ts` — **усі дані CV** (основне джерело правди)
- `src/components/`:
  - `Header.tsx` — заголовок + перемикач мови + theme toggle
  - `CVView.tsx` — основний рендер CV з секціями
  - `ThemeProvider.tsx`, `theme-context.tsx`, `ThemeToggle.tsx` — тема Latte/Mocha (збереження в localStorage)
  - `GitHubStats.tsx` — GitHub images stats
  - `AISummary.tsx` — stub “Tailored summary”
  - `PrintButton.tsx` — клієнтська кнопка `window.print()`

## Resources & common commands (Ресурси і команди)
- Встановлення і запуск:
  - `npm install`
  - `npm run dev`
- Перевірки:
  - `npm run lint`
  - `npm run build` (повинно проходити без помилок)
- PDF:
  - `GET /cv/pdf?lang=en` або `GET /cv/pdf?lang=ua`
  - збереження: **Ctrl/Cmd + P → Save as PDF** (або кнопка “Print / Save PDF”)
- Деплой:
  - Рекомендовано **Vercel** (Next.js auto-detect). Жодних env vars не потрібно.

## How to work efficiently in this repo (Як працювати швидко)
Перед змінами:
1. Подивись `src/data/cv.en.ts` і `src/data/cv.ua.ts` — чи є потрібні поля.
2. Перевір `src/components/CVView.tsx` — як зараз будуються секції.
3. Мінімізуй клієнтський код: все, що не вимагає state/effect — лишай server-side.

Типові задачі:
- **Додати нову секцію:** додай дані у `cv.*.ts` → відрендер у `CVView.tsx` через `Section`.
- **Оновити контакти/summary:** тільки у `src/data/cv.*.ts`.
- **Змінити тему/кольори:** тільки у `src/app/globals.css` (CSS vars), не у компонентах.
- **Оновити featured projects:** у `src/data/cv.*.ts` (масив `projects`) і/або `ProjectCard`.

## Guardrails (Важливо)
- Не змінюй персональні дані (email/phone/імена/лінки) без явної причини.
- Не додавай важкі залежності без потреби.
- Після змін завжди перевір:
  - `npm run lint`
  - `npm run build`
  - сторінки `/en`, `/ua`, `/cv/pdf?lang=en|ua`

## Optional future improvements (Якщо потрібно)
- Якщо додавати тести: Vitest (unit) + Playwright (e2e) — але тільки якщо реально потрібно.
- Якщо підключати справжній AI-summary: робити через окремий server route/handler і env vars, з кешуванням, без витоку ключів.
