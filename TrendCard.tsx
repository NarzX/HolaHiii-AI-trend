import { motion } from "framer-motion";
import { Eye, Heart, Share2, TrendingUp, ExternalLink } from "lucide-react";
import type { TrendItem } from "@/types";

interface TrendCardProps {
  trend: TrendItem;
  index: number;
  onAnalyze: (trend: TrendItem) => void;
}

const platformColors: Record<string, string> = {
  tiktok: "from-black to-gray-800",
  instagram: "from-purple-600 to-pink-500",
  youtube: "from-red-600 to-red-500",
  likee: "from-[#FF2E4D] to-[#FF6B7A]",
  facebook: "from-blue-600 to-blue-500",
};

const platformLabels: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube Shorts",
  likee: "Likee",
  facebook: "Facebook",
};

function formatNumber(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function TrendCard({ trend, index, onAnalyze }: TrendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={trend.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop"}
          alt={trend.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-gradient-to-r ${platformColors[trend.platform] || "from-gray-600 to-gray-500"} text-white text-[11px] font-semibold`}>
          {platformLabels[trend.platform] || trend.platform}
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-[#10B981]" />
          <span className="text-[#10B981]">{trend.trendDirection === "up" ? "+" : ""}{trend.trendScore}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#111111] line-clamp-2 mb-2">
          {trend.title}
        </h3>
        <p className="text-xs text-[#666666] line-clamp-2 mb-3">
          {trend.description}
        </p>

        {/* Creator */}
        <p className="text-xs text-[#8B5CF6] font-medium mb-3">
          {trend.creator}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[11px] text-[#666666] mb-3">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {formatNumber(trend.views)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {formatNumber(trend.likes)}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            {formatNumber(trend.shares)}
          </span>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {trend.hashtags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 bg-[#f9f9f9] text-[#666666] rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnalyze(trend)}
            className="flex-1 px-3 py-2 bg-[#8B5CF6] text-white rounded-xl text-xs font-medium hover:bg-[#7C3AED] transition-colors"
          >
            Analisis AI
          </motion.button>
          {trend.url && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={trend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-black/[0.08] rounded-xl text-[#666666] hover:bg-[#f9f9f9] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
