import { useState } from "react";
import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  isLoading = false,
  placeholder = "Find all the latest content trends...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    onSend(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-black/[0.06]">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-[#f9f9f9] rounded-xl border border-transparent focus-within:border-black/10 transition-colors p-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[#111111] placeholder:text-[#999999] placeholder:italic outline-none resize-none max-h-[120px] min-h-[40px]"
            style={{ height: "auto" }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
              message.trim() && !isLoading
                ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-[10px] text-[#999999] text-center mt-2">
          HolaHiii AI dapat membuat kesalahan. Verifikasi informasi penting.
        </p>
      </div>
    </div>
  );
}
