import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import MainSidebar from "@/components/sidebar/MainSidebar";
import ContextList from "@/components/sidebar/ContextList";

interface AppLayoutProps {
  children: React.ReactNode;
  activeSessionId: number | null;
  onSessionSelect: (id: number) => void;
  onNewChat: () => void;
  sessions: Array<{
    id: number;
    title: string;
    platform: string | null;
    updatedAt: Date;
  }>;
}

export default function AppLayout({
  children,
  activeSessionId,
  onSessionSelect,
  onNewChat,
  sessions,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-black/5 hover:bg-gray-50 transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Main Sidebar - Panel 1 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed lg:static inset-y-0 left-0 z-40 w-[260px] flex-shrink-0"
          >
            <MainSidebar onNewChat={onNewChat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Main Sidebar */}
      <div className="hidden lg:block w-[260px] flex-shrink-0">
        <MainSidebar onNewChat={onNewChat} />
      </div>

      {/* Context List - Panel 2 */}
      <div className="hidden md:block w-[300px] flex-shrink-0 bg-[#f9f9f9] border-r border-black/[0.08]">
        <ContextList
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionSelect={onSessionSelect}
        />
      </div>

      {/* Main Content - Panel 3 */}
      <div className="flex-1 min-w-0 flex flex-col">
        {children}
      </div>
    </div>
  );
}
