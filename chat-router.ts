import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatSessions, chatMessages } from "@db/schema";
import { eq, desc } from "drizzle-orm";

// In-memory store for chat sessions (fallback when DB is not available)
const memorySessions: Record<number, {
  id: number;
  userId: number | null;
  title: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Array<{
    id: number;
    role: string;
    content: string;
    metadata: Record<string, unknown> | null;
    createdAt: Date;
  }>;
}> = {};
let nextSessionId = 1;
let nextMessageId = 1;

export const chatRouter = createRouter({
  getSessions: publicQuery.query(async () => {
    try {
      const db = getDb();
      const sessions = await db
        .select()
        .from(chatSessions)
        .orderBy(desc(chatSessions.updatedAt));
      return sessions;
    } catch {
      // Return from memory
      return Object.values(memorySessions)
        .map(({ messages, ...s }) => s)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
  }),

  getSession: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const session = await db
          .select()
          .from(chatSessions)
          .where(eq(chatSessions.id, input.id))
          .limit(1);

        if (session.length === 0) {
          const memSession = memorySessions[input.id];
          if (memSession) {
            const { messages: msgs, ...rest } = memSession;
            return { ...rest, messages: msgs };
          }
          return null;
        }

        const messages = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.sessionId, input.id))
          .orderBy(chatMessages.createdAt);

        return {
          ...session[0],
          messages: messages.map(m => ({
            ...m,
            metadata: m.metadata as Record<string, unknown> | null,
          })),
        };
      } catch {
        const memSession = memorySessions[input.id];
        if (memSession) {
          const { messages: msgs, ...rest } = memSession;
          return { ...rest, messages: msgs };
        }
        return null;
      }
    }),

  createSession: publicQuery
    .input(
      z.object({
        title: z.string(),
        platform: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = getDb();
        const result = await db.insert(chatSessions).values({
          title: input.title,
          platform: input.platform || "all",
        });
        const id = Number(result[0].insertId);
        return {
          id,
          title: input.title,
          platform: input.platform || "all",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch {
        // Fallback to memory
        const id = nextSessionId++;
        memorySessions[id] = {
          id,
          userId: null,
          title: input.title,
          platform: input.platform || "all",
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        };
        return {
          id,
          title: input.title,
          platform: input.platform || "all",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }),

  sendMessage: publicQuery
    .input(
      z.object({
        sessionId: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = getDb();
        
        // Save user message
        await db.insert(chatMessages).values({
          sessionId: input.sessionId,
          role: "user",
          content: input.content,
        });

        // Update session updatedAt
        await db.update(chatSessions)
          .set({ updatedAt: new Date() })
          .where(eq(chatSessions.id, input.sessionId));

        // Generate AI response based on user message
        const aiResponse = generateAIResponse(input.content);

        // Save AI message
        const aiResult = await db.insert(chatMessages).values({
          sessionId: input.sessionId,
          role: "assistant",
          content: aiResponse.content,
          metadata: aiResponse.metadata || null,
        });

        return {
          id: Number(aiResult[0].insertId),
          role: "assistant",
          content: aiResponse.content,
          metadata: aiResponse.metadata,
          createdAt: new Date(),
        };
      } catch {
        // Fallback to memory
        const session = memorySessions[input.sessionId];
        if (!session) {
          throw new Error("Session not found");
        }

        const userMsgId = nextMessageId++;
        session.messages.push({
          id: userMsgId,
          role: "user",
          content: input.content,
          metadata: null,
          createdAt: new Date(),
        });

        const aiResponse = generateAIResponse(input.content);
        const aiMsgId = nextMessageId++;
        session.messages.push({
          id: aiMsgId,
          role: "assistant",
          content: aiResponse.content,
          metadata: aiResponse.metadata || null,
          createdAt: new Date(),
        });

        session.updatedAt = new Date();

        return {
          id: aiMsgId,
          role: "assistant",
          content: aiResponse.content,
          metadata: aiResponse.metadata,
          createdAt: new Date(),
        };
      }
    }),

  deleteSession: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const db = getDb();
        await db.delete(chatMessages).where(eq(chatMessages.sessionId, input.id));
        await db.delete(chatSessions).where(eq(chatSessions.id, input.id));
        return { success: true };
      } catch {
        delete memorySessions[input.id];
        return { success: true };
      }
    }),
});

// AI Response Generator
function generateAIResponse(userMessage: string): { content: string; metadata?: Record<string, unknown> } {
  const lowerMsg = userMessage.toLowerCase();
  
  // Trend detection keywords
  const platformKeywords: Record<string, string[]> = {
    tiktok: ["tiktok", "tt", "tik tok"],
    instagram: ["instagram", "ig", "insta", "reels"],
    youtube: ["youtube", "yt", "shorts"],
    likee: ["likee"],
    facebook: ["facebook", "fb"],
  };

  const categoryKeywords: Record<string, string[]> = {
    dance: ["dance", "tari", "joget"],
    comedy: ["comedy", "lucu", "laugh", "funny", "humor"],
    cooking: ["cooking", "masak", "resep", "makanan", "food"],
    beauty: ["beauty", "makeup", "skincare", "kecantikan"],
    education: ["education", "belajar", "tutorial", "tips"],
    fashion: ["fashion", "ootd", "style", "baju"],
    travel: ["travel", "wisata", "liburan", "trip"],
    gaming: ["gaming", "game", "main"],
    music: ["music", "musik", "lagu", "song"],
    technology: ["technology", "tech", "gadget", "hp"],
    sports: ["sports", "olahraga", "futsal", "basket"],
    news: ["news", "berita", "viral"],
  };

  // Detect platform
  let detectedPlatform = "";
  for (const [platform, keywords] of Object.entries(platformKeywords)) {
    if (keywords.some(k => lowerMsg.includes(k))) {
      detectedPlatform = platform;
      break;
    }
  }

  // Detect category
  let detectedCategory = "";
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(k => lowerMsg.includes(k))) {
      detectedCategory = category;
      break;
    }
  }

  // Check if asking for trends
  const isAskingTrends = lowerMsg.includes("tren") || lowerMsg.includes("trend") || 
    lowerMsg.includes("viral") || lowerMsg.includes("populer") || lowerMsg.includes("hits") ||
    lowerMsg.includes("cari") || lowerMsg.includes("find") || lowerMsg.includes("search") ||
    lowerMsg.includes("apa yang") || lowerMsg.includes("what's") || lowerMsg.includes("what is");

  const isAskingAnalysis = lowerMsg.includes("analisis") || lowerMsg.includes("analysis") ||
    lowerMsg.includes("kenapa") || lowerMsg.includes("why") || lowerMsg.includes("bagaimana") ||
    lowerMsg.includes("how") || lowerMsg.includes("tips") || lowerMsg.includes("saran");

  const isAskingIdeas = lowerMsg.includes("ide") || lowerMsg.includes("idea") ||
    lowerMsg.includes("konten") || lowerMsg.includes("content") || lowerMsg.includes("buat") ||
    lowerMsg.includes("create") || lowerMsg.includes("rekomendasi") || lowerMsg.includes("recommend");

  if (isAskingTrends || isAskingAnalysis || isAskingIdeas) {
    return generateTrendResponse(detectedPlatform, detectedCategory, userMessage);
  }

  // Default response
  return {
    content: `Hai! Saya HolaHiii Trend AI, asistenmu untuk menemukan konten trending! 🚀\n\nAku bisa bantu kamu dengan:\n\n📈 **Cari Tren Terkini** - Temukan konten viral di TikTok, Instagram, YouTube Shorts, Likee, dan Facebook\n\n🔍 **Analisis Tren** - Pahami kenapa suatu konten bisa viral dan siapa target audiensnya\n\n💡 **Ide Konten** - Dapatkan ide konten kreatif berdasarkan tren yang sedang happening\n\nCoba tanyakan sesuatu seperti:\n- "Tren TikTok hari ini apa saja?"\n- "Analisis tren dance terbaru"\n- "Kasih ide konten cooking yang viral"\n\nAda yang bisa aku bantu? 😊`,
  };
}

function generateTrendResponse(platform: string, category: string, _userMessage: string): { content: string; metadata?: Record<string, unknown> } {
  const platformName = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "semua platform";
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

  // Trend data based on platform and category
  const trendResponses: Record<string, Array<{ title: string; views: string; growth: string; desc: string }>> = {
    tiktok: [
      { title: "Tari 'Goyang Dayung' Challenge", views: "45.2M", growth: "+320%", desc: "Challenge tari yang mengikuti irama musik trap dengan gerakan mendayung" },
      { title: "POV: Masuk Warung Favorit", views: "28.9M", growth: "+180%", desc: "Video komedi POV yang relatable tentang warung favorit" },
      { title: "Resep Es Krim Goreng 3 Bahan", views: "56.7M", growth: "+450%", desc: "Tutorial masak viral dengan bahan sederhana" },
      { title: "Metode Belajar Feynman", views: "32.1M", growth: "+95%", desc: "Tips belajar efektif dengan animasi menarik" },
    ],
    instagram: [
      { title: "OOTD Street Style Jakarta", views: "15.4M", growth: "+120%", desc: "Fashion street style casual elegan khas Jakarta" },
      { title: "Hidden Gem: Air Terjun Sekumpul", views: "42.1M", growth: "+280%", desc: "Video cinematic destinasi wisata tersembunyi di Bali" },
      { title: "Makanan Jepang Autentik", views: "18.7M", growth: "+95%", desc: "Review restoran Jepang dengan chef asli Jepang" },
    ],
    youtube: [
      { title: "Speedrun Minecraft <10 Menit", views: "67.8M", growth: "+510%", desc: "Speedrun record baru dengan teknik canggih" },
      { title: "Cover 'Bintang di Surga' Akustik", views: "53.4M", growth: "+340%", desc: "Cover lagu Noah yang sangat emosional" },
      { title: "Review Smartphone Lipat 2026", views: "24.5M", growth: "+150%", desc: "Review mendalam gadget terbaru" },
    ],
    likee: [
      { title: "Prank Ganti Suara HP Kucing", views: "12.3M", growth: "+85%", desc: "Prank lucu dengan reaksi teman yang kocak" },
      { title: "Tari Tradisional Remix EDM", views: "18.9M", growth: "+200%", desc: "Kombinasi unik tari tradisional dengan musik modern" },
    ],
    facebook: [
      { title: "Aksi Heroik Petugas Damkar", views: "89.2M", growth: "+620%", desc: "Petugas damkar menyelamatkan kucing dari gedung" },
      { title: "DIY Dekorasi Kamar Budget 500rb", views: "34.5M", growth: "+180%", desc: "Tutorial dekor minimalis budget terbatas" },
      { title: "Skill Futsal Juggling 1000x", views: "27.8M", growth: "+130%", desc: "Aksi juggling bola yang mengagumkan" },
    ],
  };

  let response = "";
  let metadata: Record<string, unknown> = { type: "trend_analysis" };

  if (platform && trendResponses[platform]) {
    const trends = trendResponses[platform];
    const prefix = categoryName ? `tren ${categoryName} di ${platformName}` : `tren terbaru di ${platformName}`;
    
    response = `Berikut ${prefix} yang sedang viral saat ini! 🔥\n\n`;
    
    trends.forEach((trend, idx) => {
      response += `${idx + 1}. **${trend.title}**\n`;
      response += `   👁 ${trend.views} views | 📈 ${trend.growth}\n`;
      response += `   ${trend.desc}\n\n`;
    });

    response += `Tren di ${platformName} menunjukkan pertumbuhan yang sangat positif! 📊\n\n`;
    response += `Ingin aku **analisis lebih dalam** salah satu tren ini atau kasih **ide konten** berdasarkan tren tersebut?`;

    metadata = {
      type: "trend_list",
      platform,
      category: category || null,
      trends: trends.map(t => ({ ...t, platform })),
    };
  } else {
    // Show all platforms summary
    response = `Berikut ringkasan tren viral terkini di semua platform! 🌟\n\n`;
    
    for (const [pf, trends] of Object.entries(trendResponses)) {
      const pfName = pf.charAt(0).toUpperCase() + pf.slice(1);
      response += `**${pfName}** 🔥\n`;
      trends.slice(0, 2).forEach(t => {
        response += `• ${t.title} (${t.views} views)\n`;
      });
      response += `\n`;
    }

    response += `Semua platform menunjukkan pertumbuhan konten yang sangat aktif! 🚀\n\n`;
    response += `Mau aku tunjukkan tren spesifik untuk platform tertentu? Ketik nama platformnya!`;

    metadata = {
      type: "trend_overview",
      platforms: Object.keys(trendResponses),
    };
  }

  return { content: response, metadata };
}
