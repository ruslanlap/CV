"use client";

import { useMemo, useState, useRef, useEffect } from "react";

type Lang = "en" | "ua";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIChatAssistant({
    lang,
}: {
    lang: Lang;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const exampleQuestions = useMemo(() => {
        if (lang === "ua") {
            return [
                "Які Python проекти є?",
                "Який досвід з React?",
                "Розкажи про PowerToys плагіни",
                "Які технології знає?",
            ];
        }
        return [
            "What Python projects?",
            "React experience?",
            "Tell about PowerToys plugins",
            "What technologies?",
        ];
    }, [lang]);

    const placeholder = useMemo(() => {
        return lang === "en"
            ? "Ask anything about my CV..."
            : "Запитай будь-що про моє резюме...";
    }, [lang]);

    async function handleSubmit(question?: string) {
        const q = (question ?? input).trim();
        if (!q || loading) return;

        const userMessage: Message = { role: "user", content: q };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lang, question: q }),
            });

            const rlRemaining = res.headers.get("X-RateLimit-Remaining");
            if (rlRemaining !== null) {
                const v = Number(rlRemaining);
                if (!Number.isNaN(v)) setRemaining(v);
            }

            const data = (await res.json()) as
                | { answer: string }
                | { error: string; remaining?: number; reset?: number };

            if (!res.ok) {
                setError("error" in data ? data.error : "Request failed");
                return;
            }

            const assistantMessage: Message = {
                role: "assistant",
                content: "answer" in data ? data.answer : "...",
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (e) {
            setError(lang === "en" ? "Network error" : "Помилка мережі");
        } finally {
            setLoading(false);
        }
    }

    const hint =
        remaining === null
            ? null
            : lang === "en"
                ? `Remaining today: ${remaining}/5`
                : `Ліміт на сьогодні: ${remaining}/5`;

    return (
        <div className="rounded-2xl border border-border bg-mantle overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-accent/20 to-accent/5 px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <span className="font-medium text-text">
                        {lang === "en" ? "Ask My CV" : "Запитай про CV"}
                    </span>
                </div>
                <p className="text-xs text-subtext mt-1">
                    {lang === "en"
                        ? "Ask questions about my experience, projects, and skills"
                        : "Задавай питання про мій досвід, проекти та навички"}
                </p>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollContainerRef}
                className="h-[280px] overflow-y-auto p-4 space-y-3 scrollbar-thin scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="text-4xl mb-3">💬</div>
                        <p className="text-subtext text-sm">
                            {lang === "en"
                                ? "Start a conversation! Try one of these:"
                                : "Почни розмову! Спробуй один з цих:"}
                        </p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user"
                                    ? "bg-accent text-[#1e1e2e] font-medium rounded-br-sm"
                                    : "bg-base border border-border text-text rounded-bl-sm"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-base border border-border rounded-2xl rounded-bl-sm px-4 py-2.5">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-subtext rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-subtext rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-subtext rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Examples */}
            <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                    {exampleQuestions.map((q) => (
                        <button
                            key={q}
                            type="button"
                            onClick={() => handleSubmit(q)}
                            disabled={loading}
                            className="text-xs px-3 py-1.5 rounded-full bg-base border border-border text-subtext hover:text-text hover:border-accent/50 transition disabled:opacity-50"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 pt-2 border-t border-border bg-base/50">
                {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex gap-2"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-border bg-mantle px-4 py-2.5 text-sm text-text outline-none focus:ring-2 focus:ring-accent/40 transition disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-[#1e1e2e] hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </form>
                {hint && <p className="mt-2 text-xs text-subtext text-center">{hint}</p>}
            </div>
        </div>
    );
}
