import { Sparkles, Home, Settings, User, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router";

interface MainSidebarProps {
  onNewChat: () => void;
}

export default function MainSidebar({ onNewChat }: MainSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-black/[0.08]">
      {/* Header / Logo */}
      <div className="p-5 border-b border-black/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#111111] leading-tight">
              HolaHiii
            </h1>
            <p className="text-[11px] text-[#666666] leading-tight">
              Konten Trending Finder
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                    : "text-[#666666] hover:bg-gray-50 hover:text-[#111111]"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* New Chat Button */}
      <div className="p-4 border-t border-black/[0.08]">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#7C3AED" }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#8B5CF6] text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Trend Hunter</span>
        </motion.button>
      </div>
    </div>
  );
}
