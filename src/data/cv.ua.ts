export const cv = {
  name: "Руслан Лапіняк",
  role: "Full Stack Developer & DevOps Engineer",
  location: "Львів, Україна",
  contacts: {
    email: "ruslan.lapinyak@gmail.com",
    phone: "+38 09 77 33 98 55",
    telegram: "@ruslan_ls",
    github: "https://github.com/ruslanlap",
    linkedin: "LinkedIn",
  },
  summary:
    "Full Stack Developer & DevOps Engineer з великим досвідом розробки масштабованих вебзастосунків, CLI-інструментів та десктопних додатків. Володію React, TypeScript, Python та C#/.NET. Автор популярних open-source проектів: PowerToys Run плагіни, Python CLI інструменти та браузерні розширення. Захоплений автоматизацією та чистою архітектурою.",
  skills: {
    "Frontend": [
      "JavaScript (ES6+)",
      "TypeScript",
      "React.js",
      "Next.js",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "SASS/SCSS",
    ],
    "Backend & CLI": [
      "Python",
      "Node.js",
      "REST APIs",
      "Click/Typer CLI",
      "PyQt6",
    ],
    "Desktop & Плагіни": [
      "C# / .NET",
      "WPF",
      "PowerToys Run Plugins",
      "Electron",
    ],
    "DevOps & Інструменти": [
      "Git",
      "GitHub Actions",
      "Docker",
      "MkDocs",
      "CI/CD",
    ],
    "Дизайн & UI/UX": [
      "Figma",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Responsive Design",
    ],
    "Soft Skills": [
      "Лідерство",
      "Комунікація",
      "Менторство",
      "Вирішення проблем",
      "Адаптивність",
    ],
  },
  experience: [
    {
      role: "Full Stack Developer & Open Source Contributor",
      company: "Freelance",
      period: "Вересень 2016 — дотепер",
      points: [
        "Розробляв адаптивні вебзастосунки на React, TypeScript, Next.js та Tailwind CSS",
        "Створив 15+ PowerToys Run плагінів (QuickAI, Package Manager, QuickBrain, Video Downloader тощо) з 1000+ завантажень",
        "Розробив Python CLI інструменти: GH-Pulse (аналітика GitHub), EasyEnv (менеджмент середовищ), MkDocs теми",
        "Створив кросплатформні десктопні додатки на Python (PyQt6) з інтеграцією Telegram та Notion API",
        "Розробив браузерне розширення SVG Extractor Pro для Firefox та Chrome зі 100+ користувачами",
        "Налаштовував CI/CD пайплайни через GitHub Actions для автоматизованого тестування та деплою",
        "Публікував Python пакети на PyPI та підтримував документацію з MkDocs",
      ],
    },
    {
      role: "Manager & Digital Marketing",
      company: "Hotel Guest Rooms UCU",
      period: "Серпень 2015 — дотепер",
      points: [
        "Проводив digital трансформацію: сайт, інтеграції онлайн-бронювань",
        "Вів SMM та email маркетинг (CRM)",
        "Оптимізував роботу з Booking.com / Hotels24",
        "Створював рекламні матеріали в Adobe Creative Suite",
      ],
    },
  ],
  projects: [
    {
      name: "GH-Pulse",
      desc: "GitHub Productivity CLI — аналіз репозиторіїв, генерація бейджів, автоматизація README.",
      link: "https://github.com/ruslanlap/gh-pulse",
      stack: ["Python", "Click", "GitHub API", "Rich TUI"],
    },
    {
      name: "EasyEnv CLI",
      desc: "Створення ефемерних, відтворюваних, кешованих Python середовищ з TUI інтерфейсом.",
      link: "https://github.com/ruslanlap/EasyEnv",
      stack: ["Python", "Textual TUI", "uv", "YAML DSL"],
    },
    {
      name: "Telegram Saved Messages Export",
      desc: "Десктопний додаток для експорту збережених повідомлень Telegram у Notion або локальні файли.",
      link: "https://github.com/ruslanlap/Telegram-SavedMessages-Export",
      stack: ["Python", "PyQt6", "Pyrogram", "Notion API"],
    },
    {
      name: "PowerToys Run Plugins Suite",
      desc: "15+ плагінів: QuickAI (мульти-провайдер AI), Package Manager, Video Downloader, SpeedTest, Hotkeys тощо.",
      link: "https://github.com/ruslanlap/PowerToysRun-QuickAi",
      stack: ["C#", ".NET 8", "WPF", "Material Design"],
    },
    {
      name: "SVG Extractor Pro",
      desc: "Браузерне розширення для пошуку, витягування та завантаження SVG зображень з будь-яких вебсторінок.",
      link: "https://github.com/ruslanlap/SVG-Extractor-Firefox-and-Chrome-add-on",
      stack: ["JavaScript", "WebExtensions API", "HTML/CSS"],
    },
    {
      name: "MkDocs Catppuccin Theme",
      desc: "Повна інтеграція теми Catppuccin для MkDocs Material з усіма 4 flavors.",
      link: "https://github.com/ruslanlap/mkdocs-catppuccin",
      stack: ["Python", "MkDocs", "CSS/SCSS", "Jinja2"],
    },
  ],
  languages: [
    { name: "Українська", level: "Рідна" },
    { name: "Англійська", level: "Intermediate" },
  ],
  courses: [
    {
      name: "DevOps Bootcamp: Terraform, Docker, K8s",
      source: "Udemy",
      date: "2024",
    },
    {
      name: "Advanced React & Next.js Pattern",
      source: "Frontend Masters",
      date: "2023",
    },
    {
      name: "Python for Professionals: Data & Automation",
      source: "Coursera",
      date: "2023",
    },
    {
      name: "Docker Mastery: with Kubernetes + Swarm",
      source: "Udemy",
      date: "2022",
    },
  ],
  hobbies: [
    "Linux кастомізація",
    "HomeLab (Proxmox, Mini PC кластери)",
    "Open Source контрибуції",
    "Self-hosting сервісів",
  ],
} as const;

