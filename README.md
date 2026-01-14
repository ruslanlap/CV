# Ruslan Next.js CV (Tailwind + Catppuccin)

A bilingual (EN/UA) CV site built with **Next.js App Router**, **Tailwind CSS**, and **Catppuccin** themes (Latte + Mocha).

## Features
- 🌍 Bilingual routes: `/en` and `/ua`
- ✨ Theme toggle (Catppuccin **Latte** / **Mocha**) with persistence + system fallback
- ⭐ GitHub stats block (images)
- 📊 CV data separated into `src/data/cv.en.ts` and `src/data/cv.ua.ts`
- 📄 Print/PDF page: `/cv/pdf?lang=en|ua` + “Download PDF” button
- 🤖 “Tailored summary” stub (ready to connect to OpenAI later)
- 🧭 SEO helpers: `robots.txt` + `sitemap.xml`
- 🚀 Vercel-ready

## Run locally
```bash
npm install
npm run dev
```
Open:
- http://localhost:3000/en
- http://localhost:3000/ua

## PDF
Use the button on the CV page, or open directly:
- `/cv/pdf?lang=en`
- `/cv/pdf?lang=ua`

Then use **Ctrl/Cmd + P → Save as PDF**.

## Deploy to Vercel
1. Push repo to GitHub
2. Vercel → “Add New Project” → Import the repo
3. Framework auto-detected as **Next.js**
4. Deploy

## Деплой через Vercel CLI

### Встановлення Vercel CLI
```bash
npm install -g vercel
```

### Перший деплой
1. Увійдіть в акаунт Vercel:
```bash
vercel login
```

2. Запустіть деплой з кореневої директорії проєкту:
```bash
vercel
```

При першому деплої CLI запитає:
- **Set up and deploy?** → `Y`
- **Which scope?** → Виберіть свій акаунт
- **Link to existing project?** → `N` (якщо новий проєкт)
- **Project name** → Введіть назву або натисніть Enter для назви за замовчуванням
- **In which directory is your code located?** → `./` (натисніть Enter)

Vercel автоматично визначить Next.js і налаштує проєкт.

### Production деплой
```bash
vercel --prod
```

### Налаштування змінних оточення
Додайте змінні оточення через CLI:
```bash
vercel env add FIREWORKS_API_KEY
vercel env add KV_URL
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
vercel env add KV_REST_API_READ_ONLY_TOKEN
```

Або через веб-інтерфейс: **Project Settings → Environment Variables**

### Корисні команди
```bash
vercel --help          # Довідка
vercel ls              # Список деплоїв
vercel inspect [url]   # Інформація про деплой
vercel logs [url]      # Логи деплою
vercel remove [name]   # Видалити проєкт
```

## Customize
- Edit CV content in:
  - `src/data/cv.en.ts`
  - `src/data/cv.ua.ts`
- Featured projects & GitHub username:
  - `src/components/GitHubStats.tsx`
  - `src/data/cv.*.ts`


## AI summary (Fireworks)

This project includes an optional AI-powered “Tailored summary” generator.

### Env vars

- `FIREWORKS_API_KEY` (required for AI)
- `FIREWORKS_MODEL` (optional, default is a Llama instruct model id)

### Rate limit

- 5 requests per IP per day (server-side). Requires **Vercel KV**.

### Vercel KV

Create a Vercel KV database and add these env vars:

- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### Антиспам система

**Rate Limiting**: 5 запитів на IP на день (для production)

#### Як працює:
- Використовує **@upstash/ratelimit** + **Vercel KV** (Redis)
- Ідентифікація по IP адресі (`X-Forwarded-For` або `X-Real-IP`)
- Fixed window: 1 день (24 години)
- Префікси ключів: `rl:ai-chat:*` та `rl:ai-summary:*`

#### Тестування (Development):
Rate limiting **автоматично вимкнений** в dev режимі (`NODE_ENV !== 'production'`).
Просто запустіть `npm run dev` — ліміти не застосовуються! ✅

#### Скидання лімітів (Production):
1. **Через Vercel Dashboard**:
   - Storage → KV → Data Browser
   - Знайдіть ключі `rl:ai-chat:*` та `rl:ai-summary:*`
   - Видаліть потрібні ключі

2. **Через Vercel CLI**:
   ```bash
   vercel env pull .env.local
   # Потім використайте Redis CLI або скрипт для очищення
   ```

#### Налаштування лімітів:
Змініть параметри в `src/app/api/ai/*/route.ts`:
```typescript
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "1 d"), // 5 запитів на 1 день
  prefix: "rl:ai-chat",
});
```



## New Features (CV Enhancements)

### 📧 Contact Form
- Direct messaging through the website
- Real-time form validation with Zod
- Spam protection with rate limiting (3 requests/hour per IP)
- Email integration via Resend API
- Bilingual support (EN/UA)

**Required Environment Variables:**
```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL_TO=your_email@example.com
```

### 📄 Enhanced PDF Export
- Professional PDF generation with @react-pdf/renderer
- Proper typography and spacing
- Clickable links in PDF
- Print-optimized colors
- Automatic download with descriptive filename
- Bilingual support (EN/UA)

### 🎨 Scroll-Triggered Animations
- Smooth fade-in animations on scroll
- Staggered animations for visual flow
- Respects `prefers-reduced-motion` accessibility setting
- 60fps performance on modern devices
- Powered by Framer Motion

### Setup Instructions

1. **Install dependencies** (already done if you ran `npm install`):
```bash
npm install @react-pdf/renderer resend zod @upstash/redis
npm install -D fast-check @types/react-pdf
```

2. **Configure Resend** (for contact form):
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from [API Keys page](https://resend.com/api-keys)
   - Add to `.env.local`:
     ```env
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     CONTACT_EMAIL_TO=your_email@example.com
     ```

3. **Configure Upstash Redis** (for rate limiting):
   - Sign up at [upstash.com](https://upstash.com)
   - Create a Redis database
   - Get credentials from console
   - Add to `.env.local`:
     ```env
     UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
     UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
     ```

4. **Deploy environment variables to Vercel**:
```bash
vercel env add RESEND_API_KEY
vercel env add CONTACT_EMAIL_TO
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
```

### Testing

Run property-based tests:
```bash
npm test
```

Run specific test suites:
```bash
npm test -- contact-form
npm test -- pdf-export
npm test -- animations
```

### Redis Monitoring & Debugging

Monitor rate limiting and Redis keys in real-time:

```bash
# Basic connection test
node test-redis.js

# Rate limiting test (simulates 5 requests)
node test-rate-limit.js

# Advanced monitoring with detailed info
node monitor-redis.js

# Watch mode (updates every 3 seconds)
node monitor-redis.js --watch

# Simulate contact form submissions
node simulate-contact-form.js

# Clean up test keys
node cleanup-redis.js
```

**Why is my Redis database empty?** 🤔

This is normal! Rate limit keys:
- Are created only when endpoints are accessed
- Have TTL (Time To Live) and expire automatically
- Use prefixes like `ratelimit:contact:*` and `rl:ai-*`

📖 **Full documentation**: [REDIS_MONITORING.md](./REDIS_MONITORING.md)

