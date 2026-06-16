import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface ChatBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: Record<string, unknown> | null;
}

export default function ChatBubble({ role, content, metadata }: ChatBubbleProps) {
  const isUser = role === "user";

  // Parse bold text (**text**) into styled spans
  const parseContent = (text: string): ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={idx}
            className={isUser ? "text-white font-semibold" : "text-[#111111] font-semibold"}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Split content by newlines
  const lines = content.split("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] lg:max-w-[75%] px-5 py-4 ${
          isUser
            ? "bg-[#111111] text-white rounded-[18px] rounded-tr-sm"
            : "bg-[#f9f9f9] text-[#111111] rounded-[18px] rounded-tl-sm"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-[#8B5CF6] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-medium text-[#8B5CF6]">
              HolaHiii AI
            </span>
          </div>
        )}
        <div className={`text-sm leading-relaxed ${isUser ? "text-white" : "text-[#111111]"}`}>
          {lines.map((line, idx) => (
            <div key={idx} className={line.trim() === "" ? "h-2" : "mb-1 last:mb-0"}>
              {parseContent(line)}
            </div>
          ))}
        </div>

        {metadata && metadata.type === "trend_list" && Array.isArray(metadata.trends) && (
          <div className="mt-3 space-y-2">
            {metadata.trends.map(
              (trend: unknown, idx: number) => {
                const t = trend as { title: string; views: string; growth: string; platform: string };
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-3.5 border border-black/[0.06] shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium text-[#111111] flex-1">
                        {t.title}
                      </h4>
                      <span className="text-xs font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                        {t.growth}
                      </span>
                    </div>
                    <p className="text-xs text-[#666666] mt-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
                      {t.views} views
                    </p>
                  </motion.div>
                );
              }
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
