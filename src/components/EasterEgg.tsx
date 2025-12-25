"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function EasterEgg() {
  const [keys, setKeys] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key].slice(-KONAMI_CODE.length);

        if (JSON.stringify(newKeys) === JSON.stringify(KONAMI_CODE)) {
          setActivated(true);
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 5000);
          return [];
        }

        return newKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed bottom-8 right-8 z-[9999] max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/20 to-accent/10 p-6 shadow-2xl shadow-accent/20 backdrop-blur-xl">
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative">
              <div className="mb-3 text-4xl">🎉</div>
              <h3 className="mb-2 text-xl font-bold text-accent">
                Konami Code Activated!
              </h3>
              <p className="text-sm text-subtext">
                You've discovered the secret! You're clearly someone who pays attention to details.
                That's exactly the kind of person I want on my team! 🚀
              </p>
              <div className="mt-4 flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-2 w-2 rounded-full bg-accent"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {activated && (
        <div className="pointer-events-none fixed inset-0 z-[9998]">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 20,
                scale: [0, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "linear",
              }}
              className="absolute text-2xl"
            >
              {["🎯", "💻", "⚡", "🚀", "✨", "🎨", "🔥"][i % 7]}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
