import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { CV } from "@/types/cv";

export const dynamic = "force-dynamic";

// 5 requests / IP / day (server-side, persistent via Vercel KV)
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "1 d"),
  prefix: "rl:ai-summary",
});

type Lang = "en" | "ua";

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const ips = xff.split(",");
    return ips[0]?.trim() || "unknown";
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

async function loadCv(lang: Lang): Promise<CV> {
  if (lang === "ua") {
    const mod = await import("@/data/cv.ua");
    return mod.cv;
  }
  const mod = await import("@/data/cv.en");
  return mod.cv;
}

function buildPrompt(cv: CV, lang: Lang, targetRole?: string) {
  const roleLine = targetRole?.trim()
    ? (lang === "en" ? `Target role: ${targetRole.trim()}` : `Цільова роль: ${targetRole.trim()}`)
    : (lang === "en" ? "Target role: (not specified)" : "Цільова роль: (не вказано)");

  const skills = Array.isArray(cv.skills) ? cv.skills.slice(0, 24).join(", ") : "";
  const projects = Array.isArray(cv.projects)
    ? cv.projects
      .slice(0, 6)
      .map((p: any) => `${p.name}${p.stack ? ` (${p.stack})` : ""}`)
      .join("; ")
    : "";
  const exp = Array.isArray(cv.experience)
    ? cv.experience
      .slice(0, 3)
      .map((e: any) => `${e.role} @ ${e.company} — ${e.period}`)
      .join(" | ")
    : "";

  if (lang === "ua") {
    return `Ти — кар'єрний консультант. Склади короткий "Tailored summary" для CV Руслана під вказану роль.
Правила:
- 4–6 маркерів (bullet points), українською.
- Тільки факти з CV нижче + узагальнення компетенцій; не вигадуй компанії/сертифікати/роки.
- Акцент на impact, інженерну якість, продуктове мислення, інструменти для розробників.
- Уникай води; будь конкретним.
- Поверни лише маркований список, без заголовків.

${roleLine}

CV (витяг):
- Профіль: ${cv.title ?? ""}
- Коротко: ${cv.summary ?? ""}
- Ключові навички: ${skills}
- Досвід: ${exp}
- Топ проєкти: ${projects}
`;
  }

  return `You are a career coach. Write a short tailored CV summary for Ruslan for the target role.
Rules:
- 4–6 bullet points, in English.
- Use only facts from the CV below + reasonable skill generalizations; do not invent employers/certs/years.
- Emphasize impact, engineering quality, product thinking, and developer-tooling work.
- Be concrete, no fluff.
- Output ONLY the bullet list (no titles).

${roleLine}

CV (extract):
- Profile: ${cv.title ?? ""}
- Summary: ${cv.summary ?? ""}
- Key skills: ${skills}
- Experience: ${exp}
- Top projects: ${projects}
`;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Skip rate limiting in development mode
  const isDev = process.env.NODE_ENV !== 'production';

  let success = true;
  let limit = 5;
  let remaining = 5;
  let reset = 0;

  if (!isDev) {
    const rateLimitResult = await ratelimit.limit(ip);
    success = rateLimitResult.success;
    limit = rateLimitResult.limit;
    remaining = rateLimitResult.remaining;
    reset = rateLimitResult.reset;

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again tomorrow.", remaining, reset },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(Math.max(0, remaining)),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  }

  const key = process.env.FIREWORKS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Missing FIREWORKS_API_KEY env var on server." },
      { status: 500 }
    );
  }

  let body: { lang?: Lang; role?: string } = {};
  try {
    body = await req.json();
  } catch {
    // ignore
  }

  const lang: Lang = body.lang === "ua" ? "ua" : "en";
  const role = (body.role ?? "").slice(0, 120);

  const cv = await loadCv(lang);
  const prompt = buildPrompt(cv, lang, role);

  const model =
    process.env.FIREWORKS_MODEL ??
    "accounts/fireworks/models/llama-v3p1-405b-instruct";

  const fwRes = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: lang === "ua" ? "Ти корисний асистент." : "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 300,
    }),
  });

  if (!fwRes.ok) {
    const text = await fwRes.text();
    return NextResponse.json(
      { error: `Fireworks error: ${fwRes.status} ${fwRes.statusText}`, details: text.slice(0, 600) },
      {
        status: 502,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          "X-RateLimit-Reset": String(reset),
        },
      }
    );
  }

  const json = (await fwRes.json()) as any;
  const content =
    json?.choices?.[0]?.message?.content ??
    json?.choices?.[0]?.text ??
    "";

  return NextResponse.json(
    { summary: String(content).trim() },
    {
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}
