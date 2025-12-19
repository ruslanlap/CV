import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { CV } from "@/types/cv";

export const dynamic = "force-dynamic";

// 5 requests / IP / day (server-side, persistent via Vercel KV)
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.fixedWindow(5, "1 d"),
    prefix: "rl:ai-chat",
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


function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function buildCvContext(cv: CV, lang: Lang) {
    const birthDate = new Date(1990, 10, 24); // 24.11.1990
    const age = calculateAge(birthDate);
    const ageInfo = lang === "ua"
        ? `DATE OF BIRTH: 24.11.1990\nAGE: ${age} років`
        : `DATE OF BIRTH: 24.11.1990\nAGE: ${age} years old`;

    const skillsEntries = Object.entries(cv.skills ?? {});
    const skillsText = skillsEntries
        .map(([group, items]: [string, any]) => `${group}: ${(items as string[]).join(", ")}`)
        .join("\n");

    const experienceText = (cv.experience ?? [])
        .map((e: any) => `${e.role} @ ${e.company} (${e.period}):\n${(e.points ?? []).map((p: string) => `  • ${p}`).join("\n")}`)
        .join("\n\n");

    const projectsText = (cv.projects ?? [])
        .map((p: any) => `${p.name}: ${p.desc} [Stack: ${(p.stack ?? []).join(", ")}] ${p.link}`)
        .join("\n");

    const coursesText = (cv.courses ?? [])
        .map((c: any) => `${c.name} (${c.source}, ${c.date})`)
        .join("\n");

    const languagesText = (cv.languages ?? [])
        .map((l: any) => `${l.name}: ${l.level}`)
        .join(", ");

    return `
NAME: ${cv.name}
${ageInfo}
ROLE: ${cv.role}
LOCATION: ${cv.location}

CONTACTS:
- Email: ${cv.contacts?.email}
- Phone: ${cv.contacts?.phone}
- Telegram: ${cv.contacts?.telegram}
- GitHub: ${cv.contacts?.github}
- LinkedIn: ${cv.contacts?.linkedin}

SUMMARY:
${cv.summary}

SKILLS:
${skillsText}

EXPERIENCE:
${experienceText}

PROJECTS:
${projectsText}

COURSES:
${coursesText}

LANGUAGES: ${languagesText}
`.trim();
}

function buildPrompt(cvContext: string, question: string, lang: Lang) {
    if (lang === "ua") {
        return `Ти — AI асистент, який відповідає на питання про резюме Руслана. Відповідай ТІЛЬКИ на основі наданого резюме. Якщо інформації немає в резюме — чесно скажи це.

Правила:
- Відповідай коротко та по суті (2-4 речення або список)
- Використовуй факти з резюме
- Будь дружнім та професійним
- Відповідай українською

РЕЗЮМЕ:
${cvContext}

ПИТАННЯ: ${question}`;
    }

    return `You are an AI assistant answering questions about Ruslan's CV. Answer ONLY based on the provided resume. If information is not in the resume — honestly say so.

Rules:
- Answer briefly and to the point (2-4 sentences or a list)
- Use facts from the resume
- Be friendly and professional
- Answer in English

RESUME:
${cvContext}

QUESTION: ${question}`;
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

    let body: { lang?: Lang; question?: string } = {};
    try {
        body = await req.json();
    } catch {
        // ignore
    }

    const lang: Lang = body.lang === "ua" ? "ua" : "en";
    const question = (body.question ?? "").slice(0, 500).trim();

    if (!question) {
        return NextResponse.json(
            { error: lang === "en" ? "Question is required" : "Питання обов'язкове" },
            { status: 400 }
        );
    }

    const cv = await loadCv(lang);
    const cvContext = buildCvContext(cv, lang);
    const prompt = buildPrompt(cvContext, question, lang);

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
                {
                    role: "system",
                    content: lang === "ua"
                        ? "Ти — корисний асистент для відповідей на питання про резюме. Відповідай коротко та інформативно."
                        : "You are a helpful assistant for answering questions about a resume. Answer briefly and informatively.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 400,
        }),
    });

    if (!fwRes.ok) {
        const text = await fwRes.text();
        return NextResponse.json(
            { error: `AI service error: ${fwRes.status} ${fwRes.statusText}`, details: text.slice(0, 600) },
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
        { answer: String(content).trim() },
        {
            headers: {
                "X-RateLimit-Limit": String(limit),
                "X-RateLimit-Remaining": String(Math.max(0, remaining)),
                "X-RateLimit-Reset": String(reset),
            },
        }
    );
}
