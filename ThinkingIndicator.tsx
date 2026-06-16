import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const dotVariants = {
  animate: (i: number) => ({
    scale: [1, 1.3, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
      duration: 0.8,
      ease: "easeInOut" as const,
      delay: i * 0.15,
    },
  }),
};

export default function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-[#f9f9f9] rounded-[18px] rounded-tl-sm px-5 py-4 max-w-[70%]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-[#8B5CF6] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-[#8B5CF6]">
            HolaHiii AI
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={dotVariants}
              animate="animate"
              className="w-2 h-2 rounded-full bg-[#8B5CF6]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
