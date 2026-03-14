"use client";

import { motion } from "framer-motion";

interface CustomLoadingProps {
  /** "full" fills the entire page area, "inline" is compact for card/section use */
  variant?: "full" | "inline";
  /** Optional message under the spinner */
  message?: string;
}

export default function CustomLoading({
  variant = "full",
  message = "SABAR YAA MONYET LAGI LOADING",
}: CustomLoadingProps) {
  const containerClass =
    variant === "full"
      ? "w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6"
      : "flex flex-col items-center justify-center py-20 gap-6";

  return (
    <div className={containerClass}>
      {/* Hexagon Spinner */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a3e635" />
                <stop offset="100%" stopColor="#65a30d" />
              </linearGradient>
            </defs>
            <polygon
              points="40,4 72,22 72,58 40,76 8,58 8,22"
              fill="none"
              stroke="url(#hexGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="160"
              strokeDashoffset="80"
            />
          </svg>
        </motion.div>

        {/* Inner pulsing hexagon */}
        <motion.div
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 40 40" className="w-8 h-8">
            <defs>
              <linearGradient id="hexGradInner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bef264" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
            </defs>
            <polygon
              points="20,2 36,11 36,29 20,38 4,29 4,11"
              fill="url(#hexGradInner)"
              opacity="0.25"
            />
            <polygon
              points="20,8 30,13.5 30,26.5 20,32 10,26.5 10,13.5"
              fill="url(#hexGradInner)"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      </div>

      {/* Loading Dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full bg-gradient-to-br from-lime-400 to-lime-600"
          />
        ))}
      </div>

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-black font-bold tracking-widest uppercase"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
