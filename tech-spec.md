# Tech Spec — HolaHiii Trend AI

## 1. Stack Teknologi

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Frontend** | React 19 + TypeScript + Vite | UI framework utama |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Components** | shadcn/ui | Pre-built UI components (Button, Card, Input, ScrollArea, dll) |
| **Animation** | Framer Motion | Animasi bubble chat, sidebar toggle, hover effects |
| **Icons** | Lucide React | Ikon stroke-style yang konsisten |
| **State Management** | React Context + useState/useReducer | State lokal untuk chat, sidebar, dan UI |
| **Routing** | React Router v7 | Navigasi antar halaman |
| **Backend** | Hono + tRPC 11.x | API server dan type-safe RPC |
| **Database** | MySQL + Drizzle ORM | Database relasional dengan type-safe queries |
| **Auth** | OAuth 2.0 (Kimi) | Login dengan akun Kimi |
| **AI** | tRPC router dengan integrasi LLM | Analisis tren dan rekomendasi konten |

---

## 2. Struktur Database (Drizzle ORM)

### 2.1. Tabel `users`
Tabel ini dibuat otomatis oleh auth feature.

### 2.2. Tabel `chat_sessions`
Menyimpan sesi chat pengguna.

```typescript
export const chatSessions = mysqlTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  platform: varchar("platform", { length: 50 }), // "all", "tiktok", "instagram", "youtube", "likee", "facebook"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
```

### 2.3. Tabel `chat_messages`
Menyimpan pesan dalam setiap sesi chat.

```typescript
export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: bigint("session_id", { mode: "number", unsigned: true }).references(() => chatSessions.id),
  role: varchar("role", { length: 20 }).notNull(), // "user" | "assistant" | "system"
  content: text("content").notNull(),
  metadata: json("metadata"), // Untuk menyimpan data tambahan (tren, analisis, dll)
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 2.4. Tabel `trending_data`
Menyimpan data trending yang di-cache dari berbagai platform.

```typescript
export const trendingData = mysqlTable("trending_data", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(), // "tiktok", "instagram", "youtube", "likee", "facebook"
  category: varchar("category", { length: 100 }), // "dance", "cooking", "comedy", dll
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  views: bigint("views", { mode: "number" }),
  likes: bigint("likes", { mode: "number" }),
  shares: bigint("shares", { mode: "number" }),
  trendScore: decimal("trend_score", { precision: 5, scale: 2 }), // 0.00 - 100.00
  trendDirection: varchar("trend_direction", { length: 10 }), // "up", "down", "stable"
  hashtags: json("hashtags"), // Array of hashtags
  publishedAt: timestamp("published_at"),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});
```

### 2.5. Tabel `user_preferences`
Menyimpan preferensi pengguna.

```typescript
export const userPreferences = mysqlTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id).unique(),
  preferredPlatforms: json("preferred_platforms"), // ["tiktok", "instagram"]
  preferredCategories: json("preferred_categories"), // ["dance", "comedy"]
  language: varchar("language", { length: 10 }).default("id"), // "id" | "en"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
```

---

## 3. API Endpoints (tRPC Routers)

### 3.1. Router `trend`

| Procedure | Type | Input | Output | Keterangan |
|-----------|------|-------|--------|------------|
| `trend.getAll` | query | `{ platform?: string, category?: string, limit?: number }` | `TrendingData[]` | Mengambil data trending |
| `trend.getByPlatform` | query | `{ platform: string, limit?: number }` | `TrendingData[]` | Mengambil tren per platform |
| `trend.getById` | query | `{ id: number }` | `TrendingData` | Detail satu tren |
| `trend.search` | query | `{ query: string, platforms?: string[] }` | `TrendingData[]` | Cari tren berdasarkan keyword |
| `trend.getCategories` | query | `{ platform?: string }` | `string[]` | Mengambil kategori yang tersedia |

### 3.2. Router `chat`

| Procedure | Type | Input | Output | Keterangan |
|-----------|------|-------|--------|------------|
| `chat.getSessions` | query | `{ }` | `ChatSession[]` | Mengambil semua sesi chat user |
| `chat.getSession` | query | `{ id: number }` | `ChatSession & { messages: ChatMessage[] }` | Mengambil satu sesi dengan pesan |
| `chat.createSession` | mutation | `{ title: string, platform?: string }` | `ChatSession` | Membuat sesi chat baru |
| `chat.sendMessage` | mutation | `{ sessionId: number, content: string }` | `ChatMessage` | Kirim pesan user dan dapatkan respons AI |
| `chat.deleteSession` | mutation | `{ id: number }` | `{ success: boolean }` | Hapus sesi chat |

### 3.3. Router `ai`

| Procedure | Type | Input | Output | Keterangan |
|-----------|------|-------|--------|------------|
| `ai.analyzeTrend` | mutation | `{ trendId: number }` | `{ analysis: string, recommendations: string[] }` | Analisis tren dengan AI |
| `ai.getRecommendations` | mutation | `{ platform?: string, category?: string }` | `{ trends: TrendingData[], reasons: string[] }` | Rekomendasi konten dari AI |
| `ai.generateContentIdeas` | mutation | `{ topic: string, platform: string, count?: number }` | `{ ideas: string[] }` | Generate ide konten |

---

## 4. Frontend Architecture

### 4.1. Struktur Folder

```
src/
├── components/           # Komponen reusable
│   ├── ui/              # shadcn/ui components
│   ├── chat/            # Komponen chat
│   │   ├── ChatBubble.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatArea.tsx
│   │   ├── ThinkingIndicator.tsx
│   │   └── TrendCard.tsx
│   ├── sidebar/         # Komponen sidebar
│   │   ├── MainSidebar.tsx
│   │   ├── ContextList.tsx
│   │   ├── ContextCard.tsx
│   │   └── PlatformFilter.tsx
│   └── layout/          # Komponen layout
│       ├── AppLayout.tsx
│       └── MobileNav.tsx
├── pages/               # Halaman utama
│   ├── ChatPage.tsx
│   ├── TrendDashboard.tsx
│   └── SettingsPage.tsx
├── hooks/               # Custom hooks
│   ├── useChat.ts
│   ├── useTrends.ts
│   └── useAI.ts
├── providers/           # Context providers
│   ├── trpc.tsx
│   └── ChatProvider.tsx
├── types/               # TypeScript types
│   └── index.ts
├── lib/                 # Utility functions
│   └── utils.ts
├── App.tsx
└── main.tsx
```

### 4.2. Komponen Utama

#### `AppLayout`
Layout utama 3-panel:
- Panel 1: MainSidebar (260px)
- Panel 2: ContextList (300px)
- Panel 3: ChatArea (flex-1)

#### `ChatPage`
Halaman utama chat:
- Menampilkan area percakapan
- Input pesan di bawah
- Header dengan info topik

#### `TrendDashboard`
Halaman dashboard trending:
- Grid kartu tren dari berbagai platform
- Filter per platform dan kategori
- Grafik tren

---

## 5. Alur Data (Data Flow)

### 5.1. Alur Chat

```
User ketik pesan
    ↓
ChatInput → useChat hook
    ↓
trpc.chat.sendMessage (mutation)
    ↓
Backend: Simpan pesan user → Panggil AI → Simpan respons AI
    ↓
Frontend: Update cache tRPC → Tampilkan bubble chat baru
```

### 5.2. Alur Fetch Trending Data

```
User buka dashboard / minta tren di chat
    ↓
trpc.trend.getAll / trend.getByPlatform (query)
    ↓
Backend: Ambil dari DB (cache) atau fetch dari API eksternal
    ↓
Frontend: Tampilkan TrendCard / bubble chat dengan data
```

### 5.3. Alur AI Analysis

```
User klik "Analyze" pada tren
    ↓
trpc.ai.analyzeTrend (mutation)
    ↓
Backend: Ambil data tren → Kirim ke LLM dengan prompt analisis
    ↓
LLM: Generate analisis mendalam
    ↓
Frontend: Tampilkan hasil analisis dalam bubble chat
```

---

## 6. Implementasi AI

### 6.1. Prompt Engineering

**Prompt untuk Analisis Tren:**
```
Kamu adalah HolaHiii Trend AI, seorang ahli analisis konten media sosial. 
Analisis tren berikut dan berikan insight mendalam:

Judul: {title}
Platform: {platform}
Views: {views}
Likes: {likes}
Shares: {shares}
Hashtags: {hashtags}

Berikan analisis dalam format:
1. Ringkasan (2-3 kalimat)
2. Mengapa tren ini viral (faktor utama)
3. Target audiens
4. Rekomendasi strategi konten
5. Prediksi masa depan tren

Jawab dalam Bahasa Indonesia yang santai dan engaging.
```

**Prompt untuk Rekomendasi Konten:**
```
Kamu adalah HolaHiii Trend AI. Berdasarkan tren terkini di {platform}, 
berikan {count} ide konten yang bisa dibuat oleh creator.

Setiap ide harus mencakup:
- Judul konten
- Format (video/photo/reels/shorts)
- Hook/pembuka yang menarik
- Hashtag yang relevan
- Estimasi potensi jangkauan

Jawab dalam Bahasa Indonesia.
```

### 6.2. Integrasi LLM

Menggunakan tRPC router dengan HTTP client untuk mengirim prompt ke LLM API dan menerima respons.

---

## 7. Fitur Platform Trending

### 7.1. Platform yang Didukung

| Platform | Data yang Diambil | Metode |
|----------|-------------------|--------|
| **TikTok** | Popular videos, hashtags, sounds | Simulasi data realistis |
| **Instagram** | Top reels, trending hashtags | Simulasi data realistis |
| **YouTube Shorts** | Trending shorts, topics | Simulasi data realistis |
| **Likee** | Popular videos, creators | Simulasi data realistis |
| **Facebook** | Trending videos, pages | Simulasi data realistis |

### 7.2. Kategori Konten

- Dance / Music
- Comedy / Entertainment
- Cooking / Food
- Beauty / Fashion
- Education / Tutorial
- Gaming
- Sports / Fitness
- Travel / Lifestyle
- Technology
- News / Current Events

---

## 8. Responsive Breakpoints

| Breakpoint | Lebar | Layout |
|------------|-------|--------|
| **Desktop** | > 1024px | 3 panel penuh |
| **Tablet** | 768px - 1024px | Panel 1 tersembunyi (hamburger), Panel 2 + 3 terlihat |
| **Mobile** | < 768px | Hanya Panel 3 (chat), FAB untuk new chat |

---

## 9. Animasi Detail (Framer Motion)

### 9.1. Bubble Chat Muncul

```typescript
const bubbleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};
```

### 9.2. Sidebar Toggle

```typescript
const sidebarVariants = {
  closed: { x: "-100%", transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  open: { x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
};
```

### 9.3. Hover Kartu

```typescript
const cardHoverVariants = {
  rest: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: { 
    y: -2, 
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: { duration: 0.15, ease: "easeOut" }
  }
};
```

### 9.4. Loading Indicator (3 Dots)

```typescript
const dotVariants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
  }
};
```

---

## 10. Rencana Implementasi

### Phase 1: Setup (Hari 1)
- [x] Initialize webapp-building
- [x] Initialize backend-building (with auth)
- [ ] Setup database schema
- [ ] Push schema to DB

### Phase 2: Backend (Hari 2)
- [ ] Implement tRPC routers (trend, chat, ai)
- [ ] Setup AI integration
- [ ] Seed dummy trending data

### Phase 3: Frontend Core (Hari 3)
- [ ] Build AppLayout (3-panel)
- [ ] Build MainSidebar
- [ ] Build ContextList
- [ ] Build ChatArea with bubbles

### Phase 4: Frontend Features (Hari 4)
- [ ] Build TrendCard component
- [ ] Build TrendDashboard page
- [ ] Implement animations
- [ ] Connect to tRPC APIs

### Phase 5: Polish & Deploy (Hari 5)
- [ ] Responsive design
- [ ] Testing
- [ ] Build & Deploy
