import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { trendingData } from "@db/schema";
import { eq, desc, and, like } from "drizzle-orm";

// Fallback seed data if DB is empty
const fallbackTrends = [
  {
    id: 1,
    platform: "tiktok",
    category: "dance",
    title: "Tari 'Goyang Dayung' Challenge - Viral di Indonesia",
    description: "Challenge tari goyang dayung yang meniru gerakan mendayung perahu dengan irama musik trap. Sudah diikuti oleh jutaan creator.",
    url: "https://tiktok.com/tag/goyangdayung",
    thumbnailUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=600&fit=crop",
    creator: "@dancemaster_id",
    views: 45200000,
    likes: 3800000,
    shares: 1200000,
    trendScore: "96.50",
    trendDirection: "up",
    hashtags: ["#goyangdayung", "#dancechallenge", "#viralindonesia", "#tiktokdance"],
    publishedAt: new Date("2026-06-10"),
    fetchedAt: new Date(),
  },
  {
    id: 2,
    platform: "tiktok",
    category: "comedy",
    title: "POV: Masuk Warung Favorit Tapi Menu Beda",
    description: "Video komedi POV yang mengharukan tentang pengalaman masuk warung favorit tapi menunya sudah berubah.",
    url: "https://tiktok.com/tag/warungfavorit",
    thumbnailUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=600&fit=crop",
    creator: "@komedi.ID",
    views: 28900000,
    likes: 2100000,
    shares: 890000,
    trendScore: "92.30",
    trendDirection: "up",
    hashtags: ["#POV", "#komedi", "#viral", "#relatable", "#indonesia"],
    publishedAt: new Date("2026-06-12"),
    fetchedAt: new Date(),
  },
  {
    id: 3,
    platform: "tiktok",
    category: "cooking",
    title: "Resep Es Krim Goreng 3 Bahan - Viral!",
    description: "Tutorial membuat es krim goreng hanya dengan 3 bahan sederhana. Video ini mendapatkan jutaan views dalam waktu singkat.",
    url: "https://tiktok.com/tag/eskrikgoreng",
    thumbnailUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=600&fit=crop",
    creator: "@masakhits",
    views: 56700000,
    likes: 4500000,
    shares: 2300000,
    trendScore: "98.10",
    trendDirection: "up",
    hashtags: ["#resepsimple", "#masakviral", "#eskrikgoreng", "#3bahan"],
    publishedAt: new Date("2026-06-14"),
    fetchedAt: new Date(),
  },
  {
    id: 4,
    platform: "instagram",
    category: "fashion",
    title: "OOTD Street Style Jakarta - Casual Elegan",
    description: "Inspirasi outfit of the day dengan gaya street style khas Jakarta yang casual tapi tetap elegan.",
    url: "https://instagram.com/reel/ootdjakarta",
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
    creator: "@fashionjkt.id",
    views: 15400000,
    likes: 1200000,
    shares: 340000,
    trendScore: "87.50",
    trendDirection: "up",
    hashtags: ["#OOTD", "#streetstyle", "#jakarta", "#fashionindonesia"],
    publishedAt: new Date("2026-06-12"),
    fetchedAt: new Date(),
  },
  {
    id: 5,
    platform: "instagram",
    category: "travel",
    title: "Hidden Gem Bali: Air Terjun Sekumpul",
    description: "Video cinematic tentang keindahan air terjun Sekumpul di Bali yang masih tersembunyi.",
    url: "https://instagram.com/reel/sekumpulbali",
    thumbnailUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=600&fit=crop",
    creator: "@traveller.id",
    views: 42100000,
    likes: 3500000,
    shares: 1800000,
    trendScore: "97.80",
    trendDirection: "up",
    hashtags: ["#bali", "#hiddengem", "#airterjun", "#travelindonesia"],
    publishedAt: new Date("2026-06-14"),
    fetchedAt: new Date(),
  },
  {
    id: 6,
    platform: "youtube",
    category: "gaming",
    title: "Speedrun Minecraft Under 10 Minutes!",
    description: "Video speedrun Minecraft yang menakjubkan dengan waktu di bawah 10 menit.",
    url: "https://youtube.com/shorts/mcspeedrun",
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
    creator: "@gamerpro.id",
    views: 67800000,
    likes: 5200000,
    shares: 3100000,
    trendScore: "99.20",
    trendDirection: "up",
    hashtags: ["#minecraft", "#speedrun", "#gaming", "#shorts"],
    publishedAt: new Date("2026-06-15"),
    fetchedAt: new Date(),
  },
  {
    id: 7,
    platform: "youtube",
    category: "music",
    title: "Cover Lagu Viral 'Bintang di Surga' - Versi Akustik",
    description: "Cover lagu Noah 'Bintang di Surga' dengan versi akustik yang sangat emosional.",
    url: "https://youtube.com/shorts/bintangdisurga",
    thumbnailUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=600&fit=crop",
    creator: "@musisi.jalanan",
    views: 53400000,
    likes: 4200000,
    shares: 2100000,
    trendScore: "95.80",
    trendDirection: "up",
    hashtags: ["#cover", "#akustik", "#noah", "#musikindonesia"],
    publishedAt: new Date("2026-06-14"),
    fetchedAt: new Date(),
  },
  {
    id: 8,
    platform: "likee",
    category: "comedy",
    title: "Prank Teman: Ganti Suara HP dengan Kucing",
    description: "Video prank lucu mengganti nada dering HP teman dengan suara kucing yang keras.",
    url: "https://likee.video/prankkucing",
    thumbnailUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=600&fit=crop",
    creator: "@prankster.fun",
    views: 12300000,
    likes: 890000,
    shares: 420000,
    trendScore: "85.30",
    trendDirection: "up",
    hashtags: ["#prank", "#kucing", "#lucu", "#viral"],
    publishedAt: new Date("2026-06-10"),
    fetchedAt: new Date(),
  },
  {
    id: 9,
    platform: "likee",
    category: "dance",
    title: "Tari Tradisional Remix - Modern Meets Traditional",
    description: "Tarian tradisional Indonesia yang di-remix dengan musik modern EDM.",
    url: "https://likee.video/tradisionaldance",
    thumbnailUrl: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=600&fit=crop",
    creator: "@budaya.modern",
    views: 18900000,
    likes: 1400000,
    shares: 670000,
    trendScore: "90.10",
    trendDirection: "up",
    hashtags: ["#tarian", "#tradisional", "#remix", "#budaya"],
    publishedAt: new Date("2026-06-12"),
    fetchedAt: new Date(),
  },
  {
    id: 10,
    platform: "facebook",
    category: "news",
    title: "Viral: Aksi Heroik Petugas Damkar Selamatkan Kucing",
    description: "Video memukau petugas pemadam kebakaran yang berhasil menyelamatkan seekor kucing dari gedung bertingkat.",
    url: "https://facebook.com/watch/damkarkucing",
    thumbnailUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=600&fit=crop",
    creator: "@berita.viral.id",
    views: 89200000,
    likes: 7100000,
    shares: 4500000,
    trendScore: "99.80",
    trendDirection: "up",
    hashtags: ["#hero", "#damkar", "#kucing", "#viral"],
    publishedAt: new Date("2026-06-15"),
    fetchedAt: new Date(),
  },
  {
    id: 11,
    platform: "facebook",
    category: "lifestyle",
    title: "DIY Dekorasi Kamar Minimalis dengan Budget 500rb",
    description: "Tutorial DIY mendekorasi kamar dengan gaya minimalis hanya dengan budget Rp 500.000.",
    url: "https://facebook.com/watch/diykamar",
    thumbnailUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=600&fit=crop",
    creator: "@lifestyle.hacks",
    views: 34500000,
    likes: 2600000,
    shares: 1300000,
    trendScore: "93.50",
    trendDirection: "up",
    hashtags: ["#DIY", "#dekorasi", "#minimalis", "#budget"],
    publishedAt: new Date("2026-06-13"),
    fetchedAt: new Date(),
  },
  {
    id: 12,
    platform: "facebook",
    category: "sports",
    title: "Skill Futsal Gila: Juggling 1000 Kali Tanpa Jatuh!",
    description: "Video menakjubkan pemain futsal yang berhasil melakukan juggling bola sebanyak 1000 kali tanpa jatuh.",
    url: "https://facebook.com/watch/futsalskill",
    thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    creator: "@sport.extreme",
    views: 27800000,
    likes: 2100000,
    shares: 980000,
    trendScore: "91.20",
    trendDirection: "up",
    hashtags: ["#futsal", "#skill", "#olahraga", "#viral"],
    publishedAt: new Date("2026-06-11"),
    fetchedAt: new Date(),
  },
  {
    id: 13,
    platform: "tiktok",
    category: "beauty",
    title: "Makeup Transformation: Before vs After",
    description: "Video makeup transformation yang menunjukkan perubahan drastis sebelum dan sesudah makeup.",
    url: "https://tiktok.com/tag/makeuptf",
    thumbnailUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=600&fit=crop",
    creator: "@beautyqueen.id",
    views: 19800000,
    likes: 1600000,
    shares: 540000,
    trendScore: "88.70",
    trendDirection: "up",
    hashtags: ["#makeuptf", "#beforeafter", "#beauty", "#produklokal"],
    publishedAt: new Date("2026-06-11"),
    fetchedAt: new Date(),
  },
  {
    id: 14,
    platform: "tiktok",
    category: "education",
    title: "Tips Belajar Efektif - Metode Feynman",
    description: "Penjelasan singkat tentang metode belajar Feynman yang efektif untuk pelajar dan mahasiswa.",
    url: "https://tiktok.com/tag/metodefeynman",
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=600&fit=crop",
    creator: "@edukasi.viral",
    views: 32100000,
    likes: 2800000,
    shares: 1100000,
    trendScore: "94.20",
    trendDirection: "up",
    hashtags: ["#edukasi", "#tipsbelajar", "#metodefeynman", "#studytips"],
    publishedAt: new Date("2026-06-13"),
    fetchedAt: new Date(),
  },
  {
    id: 15,
    platform: "instagram",
    category: "food",
    title: "Makanan Jepang Autentik di Jakarta",
    description: "Review restoran Jepang autentik di Jakarta dengan chef asal Jepang.",
    url: "https://instagram.com/reel/japanesefoodjkt",
    thumbnailUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=600&fit=crop",
    creator: "@kuliner.mantap",
    views: 18700000,
    likes: 1400000,
    shares: 560000,
    trendScore: "89.40",
    trendDirection: "up",
    hashtags: ["#kuliner", "#japanesefood", "#jakarta", "#foodie"],
    publishedAt: new Date("2026-06-11"),
    fetchedAt: new Date(),
  },
  {
    id: 16,
    platform: "youtube",
    category: "technology",
    title: "Review Smartphone Lipat Terbaru 2026",
    description: "Review mendalam smartphone lipat terbaru yang baru rilis di Indonesia.",
    url: "https://youtube.com/shorts/foldablereview",
    thumbnailUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop",
    creator: "@teknologi_update",
    views: 24500000,
    likes: 1900000,
    shares: 780000,
    trendScore: "91.60",
    trendDirection: "up",
    hashtags: ["#review", "#smartphone", "#teknologi", "#2026"],
    publishedAt: new Date("2026-06-13"),
    fetchedAt: new Date(),
  },
];

export const trendRouter = createRouter({
  getAll: publicQuery
    .input(
      z.object({
        platform: z.string().optional(),
        category: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const conditions = [];

        if (input?.platform) {
          conditions.push(eq(trendingData.platform, input.platform));
        }
        if (input?.category) {
          conditions.push(eq(trendingData.category, input.category));
        }

        const result = await db
          .select()
          .from(trendingData)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(trendingData.trendScore))
          .limit(input?.limit || 20);

        if (result.length === 0) {
          // Return fallback data if DB is empty
          let filtered = fallbackTrends;
          if (input?.platform) {
            filtered = filtered.filter(t => t.platform === input.platform);
          }
          if (input?.category) {
            filtered = filtered.filter(t => t.category === input.category);
          }
          return filtered.slice(0, input?.limit || 20);
        }

        return result.map(r => ({
          ...r,
          hashtags: Array.isArray(r.hashtags) ? r.hashtags : 
            typeof r.hashtags === 'string' ? JSON.parse(r.hashtags) : [],
        }));
      } catch {
        // Return fallback data on error
        let filtered = fallbackTrends;
        if (input?.platform) {
          filtered = filtered.filter(t => t.platform === input.platform);
        }
        if (input?.category) {
          filtered = filtered.filter(t => t.category === input.category);
        }
        return filtered.slice(0, input?.limit || 20);
      }
    }),

  getByPlatform: publicQuery
    .input(
      z.object({
        platform: z.string(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const result = await db
          .select()
          .from(trendingData)
          .where(eq(trendingData.platform, input.platform))
          .orderBy(desc(trendingData.trendScore))
          .limit(input.limit);

        if (result.length === 0) {
          return fallbackTrends
            .filter(t => t.platform === input.platform)
            .slice(0, input.limit);
        }

        return result.map(r => ({
          ...r,
          hashtags: Array.isArray(r.hashtags) ? r.hashtags : 
            typeof r.hashtags === 'string' ? JSON.parse(r.hashtags) : [],
        }));
      } catch {
        return fallbackTrends
          .filter(t => t.platform === input.platform)
          .slice(0, input.limit);
      }
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const result = await db
          .select()
          .from(trendingData)
          .where(eq(trendingData.id, input.id))
          .limit(1);

        if (result.length === 0) {
          return fallbackTrends.find(t => t.id === input.id) || null;
        }

        const r = result[0];
        return {
          ...r,
          hashtags: Array.isArray(r.hashtags) ? r.hashtags : 
            typeof r.hashtags === 'string' ? JSON.parse(r.hashtags) : [],
        };
      } catch {
        return fallbackTrends.find(t => t.id === input.id) || null;
      }
    }),

  search: publicQuery
    .input(
      z.object({
        query: z.string(),
        platforms: z.array(z.string()).optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const conditions = [
          like(trendingData.title, `%${input.query}%`),
        ];

        // Platform filtering is handled in the fallback below

        const result = await db
          .select()
          .from(trendingData)
          .where(and(...conditions))
          .orderBy(desc(trendingData.trendScore))
          .limit(input.limit);

        if (result.length === 0) {
          let filtered = fallbackTrends.filter(t =>
            t.title.toLowerCase().includes(input.query.toLowerCase()) ||
            t.description?.toLowerCase().includes(input.query.toLowerCase())
          );
          if (input.platforms && input.platforms.length > 0) {
            filtered = filtered.filter(t => input.platforms!.includes(t.platform));
          }
          return filtered.slice(0, input.limit);
        }

        return result.map(r => ({
          ...r,
          hashtags: Array.isArray(r.hashtags) ? r.hashtags : 
            typeof r.hashtags === 'string' ? JSON.parse(r.hashtags) : [],
        }));
      } catch {
        let filtered = fallbackTrends.filter(t =>
          t.title.toLowerCase().includes(input.query.toLowerCase()) ||
          t.description?.toLowerCase().includes(input.query.toLowerCase())
        );
        if (input.platforms && input.platforms.length > 0) {
          filtered = filtered.filter(t => input.platforms!.includes(t.platform));
        }
        return filtered.slice(0, input.limit);
      }
    }),

  getCategories: publicQuery
    .input(z.object({ platform: z.string().optional() }).optional())
    .query(async () => {
      const allCategories = [
        "dance", "comedy", "cooking", "beauty", "education",
        "fashion", "travel", "food", "gaming", "music",
        "technology", "lifestyle", "sports", "news"
      ];
      return allCategories;
    }),

  getPlatforms: publicQuery.query(() => {
    return [
      { id: "tiktok", name: "TikTok", icon: "Music" },
      { id: "instagram", name: "Instagram", icon: "Camera" },
      { id: "youtube", name: "YouTube Shorts", icon: "Play" },
      { id: "likee", name: "Likee", icon: "Heart" },
      { id: "facebook", name: "Facebook", icon: "Facebook" },
    ];
  }),
});
