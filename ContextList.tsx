import { Search, Music, Camera, Play, Heart, Facebook, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ContextListProps {
  sessions: Array<{
    id: number;
    title: string;
    platform: string | null;
    updatedAt: Date;
  }>;
  activeSessionId: number | null;
  onSessionSelect: (id: number) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  tiktok: <Music className="w-4 h-4" />,
  instagram: <Camera className="w-4 h-4" />,
  youtube: <Play className="w-4 h-4" />,
  likee: <Heart className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  all: <TrendingUp className="w-4 h-4" />,
};

const platformColors: Record<string, string> = {
  tiktok: "bg-black text-white",
  instagram: "bg-gradient-to-br from-purple-600 to-pink-500 text-white",
  youtube: "bg-red-600 text-white",
  likee: "bg-[#FF2E4D] text-white",
  facebook: "bg-blue-600 text-white",
  all: "bg-[#8B5CF6] text-white",
};

export default function ContextList({
  sessions,
  activeSessionId,
  onSessionSelect,
}: ContextListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-black/[0.08]">
        <div className="flex items-center gap-2 mb-3">
          <select className="text-xs font-medium text-[#666666] bg-white border border-black/[0.08] rounded-lg px-2 py-1.5 outline-none focus:border-[#8B5CF6]/30">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-black/[0.08] rounded-xl text-sm outline-none focus:border-[#8B5CF6]/30 placeholder:text-[#999999] placeholder:italic"
          />
        </div>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 text-[#999999] text-sm">
            No chats yet
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const platform = session.platform || "all";
            return (
              <motion.button
                key={session.id}
                whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSessionSelect(session.id)}
                className={`w-full text-left p-3.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-white shadow-sm border border-black/[0.06]"
                    : "hover:bg-white/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      platformColors[platform] || platformColors.all
                    }`}
                  >
                    {platformIcons[platform] || platformIcons.all}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#111111] truncate">
                      {session.title}
                    </p>
                    <p className="text-[11px] text-[#999999] mt-0.5">
                      {new Date(session.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
