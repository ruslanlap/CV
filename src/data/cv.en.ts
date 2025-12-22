import { CV } from "@/types/cv";

export const cv: CV = {
  name: "Ruslan Lapiniak",
  role: "Full Stack Developer & DevOps Engineer",
  location: "Lviv, Ukraine",
  contacts: {
    email: "ruslan.lapinyak@gmail.com",
    phone: "+38 09 77 33 98 55",
    telegram: "@ruslan_ls",
    github: "ruslanlap",
    linkedin: "LinkedIn",
  },
  summary:
    "Full Stack Developer & DevOps Engineer with extensive experience building scalable web applications, Telegram bots, CLI tools, and desktop apps. Proficient in React, TypeScript, Python, and C#/.NET. Creator of popular open-source projects including PowerToys Run plugins, Python CLI tools, and browser extensions. Passionate about developer experience, automation, and clean architecture.",
  skills: {
    "Frontend Development": [
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
      "Telegram Bot API",
      "Click/Typer CLI",
      "PyQt6",
    ],
    "Desktop & Plugins": [
      "C# / .NET",
      "WPF",
      "PowerToys Run Plugins",
      "Electron",
    ],
    "DevOps & Tools": [
      "Git",
      "GitHub Actions",
      "Docker",
      "MkDocs",
      "CI/CD",
      "MCP (Model Context Protocol)",
    ],
    "Design & UI/UX": [
      "Figma",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Responsive Design",
    ],
    "Soft Skills": [
      "Leadership",
      "Communication",
      "Mentoring",
      "Problem Solving",
      "Adaptability",
    ],
  },
  experience: [
    {
      role: "Full Stack Developer & Open Source Contributor",
      company: "Freelance",
      period: "September 2020 — Present",
      points: [
        "Developed responsive web applications using React, TypeScript, Next.js, and Tailwind CSS",
        "Created 15+ PowerToys Run plugins (QuickAI, Package Manager, QuickBrain, Video Downloader, etc.) with 1000+ downloads",
        "Developed and maintained complex Telegram bots using Python (Aiogram, Pyrogram) and Node.js",
        "Built Python CLI tools: GH-Pulse (GitHub analytics), EasyEnv (environment management), Emoji Styler, and MkDocs themes",
        "Developed MCP (Model Context Protocol) servers for AI-powered performance analysis (PageSpeed Insights MCP)",
        "Developed cross-platform desktop applications using Python (PyQt6) with Telegram and Notion API integrations",
        "Created SVG Extractor Pro browser extension for Firefox and Chrome with 100+ users",
        "Implemented CI/CD pipelines using GitHub Actions for automated testing and deployments",
        "Published Python packages to PyPI and maintained documentation with MkDocs",
      ],
    },
    {
      role: "Manager & Digital Marketing",
      company: "Hotel Guest Rooms UCU",
      period: "August 2015 — Present",
      points: [
        "Led digital transformation initiatives including website development and online booking integration",
        "Managed social media presence (SMM) and email marketing campaigns (CRM)",
        "Developed custom solutions for reservation systems optimization (Booking.com, Hotels24)",
        "Created advertising materials and promotional content using Adobe Creative Suite",
      ],
    },
  ],
  projects: [
    {
      name: "GH-Pulse",
      desc: "GitHub Productivity CLI — Analyze repositories, generate badges, and automate README updates.",
      link: "https://github.com/ruslanlap/gh-pulse",
      stack: ["Python", "Click", "GitHub API", "Rich TUI"],
    },
    {
      name: "EasyEnv CLI",
      desc: "Create ephemeral, reproducible, cached Python dev environments with TUI interface.",
      link: "https://github.com/ruslanlap/EasyEnv",
      stack: ["Python", "Textual TUI", "uv", "YAML DSL"],
    },
    {
      name: "Telegram Saved Messages Export",
      desc: "Desktop app to export and backup Telegram saved messages to Notion or local files.",
      link: "https://github.com/ruslanlap/Telegram-SavedMessages-Export",
      stack: ["Python", "PyQt6", "Pyrogram", "Notion API"],
    },
    {
      name: "PowerToys Run Plugins Suite",
      desc: "15+ plugins: QuickAI (multi-provider AI), Package Manager, Video Downloader, SpeedTest, Hotkeys, and more.",
      link: "https://github.com/ruslanlap/PowerToysRun-QuickAi",
      stack: ["C#", ".NET 8", "WPF", "Material Design"],
    },
    {
      name: "SVG Extractor Pro",
      desc: "Browser extension to find, extract, and download SVG images from any web page.",
      link: "https://github.com/ruslanlap/SVG-Extractor-Firefox-and-Chrome-add-on",
      stack: ["JavaScript", "WebExtensions API", "HTML/CSS"],
    },
    {
      name: "PageSpeed Insights MCP",
      desc: "MCP server for Google PageSpeed Insights API that enables performance analysis directly through AI assistants.",
      link: "https://github.com/ruslanlap/pagespeed-insights-mcp",
      stack: ["TypeScript", "Node.js", "MCP SDK", "Google API"],
    },
    {
      name: "Emoji Styler",
      desc: "Transform boring text into fun emoji styles! Make your text stand out with various thematic styles. Web & CLI.",
      link: "https://github.com/ruslanlap/emoji-styler",
      stack: ["Python", "Click", "Vercel", "Tailwind CSS"],
    },
    {
      name: "MkDocs Catppuccin Theme",
      desc: "Complete Catppuccin theme integration for MkDocs Material with all 4 flavors.",
      link: "https://github.com/ruslanlap/mkdocs-catppuccin",
      stack: ["Python", "MkDocs", "CSS/SCSS", "Jinja2"],
    },
  ],
  languages: [
    { name: "Ukrainian", level: "Native" },
    { name: "English", level: "Intermediate" },
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
    "Linux Customization & Ricing",
    "HomeLab (Proxmox, Mini PC clusters)",
    "Open Source Contribution",
    "Self-hosting Services",
  ],
};

